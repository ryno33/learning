#!/usr/bin/env python3
from aws_cdk import (
    Stack,
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_ecs_patterns as ecs_patterns,
    aws_logs as logs,
    Duration,
    RemovalPolicy,
    CfnOutput
)
from constructs import Construct

class SimpleEcsWebAppStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        
        # ==============================================
        # 設定値 - ここを変更してください
        # ==============================================
        
        # あなたのパブリックIPアドレスを設定（curl https://ipinfo.io/ip で確認）
        ALLOWED_IP = "YOUR_PUBLIC_IP/32"  # 例: "123.456.789.123/32"
        
        # ==============================================
        # VPC（仮想ネットワーク）の作成
        # ==============================================
        
        vpc = ec2.Vpc(
            self, "SimpleVpc",
            max_azs=2,  # 可用性ゾーン2つのみ（コスト削減）
            nat_gateways=0,  # NATゲートウェイなし（月約$45削減）
            subnet_configuration=[
                ec2.SubnetConfiguration(
                    name="public",
                    subnet_type=ec2.SubnetType.PUBLIC,  # パブリックサブネットのみ
                    cidr_mask=24
                )
            ],
            enable_dns_hostnames=True,
            enable_dns_support=True
        )
        
        # ==============================================
        # ECSクラスター（コンテナ管理サービス）
        # ==============================================
        
        cluster = ecs.Cluster(
            self, "SimpleCluster",
            vpc=vpc,
            cluster_name="simple-web-cluster"
        )
        
        # ==============================================
        # セキュリティグループ（ファイアウォール設定）
        # ==============================================
        
        security_group = ec2.SecurityGroup(
            self, "WebAppSecurityGroup",
            vpc=vpc,
            description="Security group for simple web app - allows access from specific IP only",
            allow_all_outbound=True  # アウトバウンド通信は全て許可
        )
        
        # 特定IPからのHTTPアクセスのみ許可
        security_group.add_ingress_rule(
            peer=ec2.Peer.ipv4(ALLOWED_IP),
            connection=ec2.Port.tcp(80),
            description=f"HTTP access from {ALLOWED_IP}"
        )
        
        # ==============================================
        # CloudWatch Logs（ログ管理）
        # ==============================================
        
        log_group = logs.LogGroup(
            self, "WebAppLogGroup",
            log_group_name="/ecs/simple-web-app",
            retention=logs.RetentionDays.ONE_WEEK,  # 1週間のみ保持（コスト削減）
            removal_policy=RemovalPolicy.DESTROY  # スタック削除時にログも削除
        )
        
        # ==============================================
        # ECS Fargateサービス（コンテナアプリケーション）
        # ==============================================
        
        fargate_service = ecs_patterns.ApplicationLoadBalancedFargateService(
            self, "SimpleWebApp",
            cluster=cluster,
            
            # リソース設定（最小構成でコスト削減）
            cpu=256,  # 0.25 vCPU（最小値）
            memory_limit_mib=512,  # 512MB RAM（最小値）
            desired_count=1,  # インスタンス数1個のみ
            
            # コンテナ設定
            task_image_options=ecs_patterns.ApplicationLoadBalancedTaskImageOptions(
                image=ecs.ContainerImage.from_registry("nginx:alpine"),  # 軽量なNginx
                container_port=80,
                
                # ログ設定
                log_driver=ecs.LogDrivers.aws_logs(
                    stream_prefix="simple-web-app",
                    log_group=log_group
                ),
                
                # 環境変数
                environment={
                    "ENV": "production",
                    "APP_NAME": "SimpleWebApp",
                    "VERSION": "1.0.0"
                }
            ),
            
            # ネットワーク設定
            public_load_balancer=True,  # パブリックロードバランサー
            assign_public_ip=True  # パブリックIP割り当て
        )
        
        # ==============================================
        # ALBセキュリティグループの上書き設定
        # ==============================================
        
        # ALBのセキュリティグループを取得
        alb_security_group = fargate_service.load_balancer.connections.security_groups[0]
        
        # 既存のインバウンドルールをすべてクリア
        alb_security_group.connections.allow_from_any_ipv4(ec2.Port.tcp(80))
        
        # CFN レベルで直接セキュリティグループルールを定義
        ec2.CfnSecurityGroupIngress(
            self, "ALBSpecificIPAccess",
            group_id=alb_security_group.security_group_id,
            ip_protocol="tcp",
            from_port=80,
            to_port=80,
            cidr_ip=ALLOWED_IP,
            description=f"HTTP access from {ALLOWED_IP} only"
        )
        
        # ==============================================
        # ヘルスチェック設定
        # ==============================================
        
        fargate_service.target_group.configure_health_check(
            path="/",  # ルートパスでヘルスチェック
            healthy_http_codes="200",
            timeout=Duration.seconds(5),  # health_check_timeout → timeout
            interval=Duration.seconds(30),  # health_check_interval → interval
            healthy_threshold_count=2,  # 2回成功で正常判定
            unhealthy_threshold_count=3  # 3回失敗で異常判定
        )
        
        # ==============================================
        # 出力値（デプロイ後に表示される情報）
        # ==============================================
        
        CfnOutput(
            self, "LoadBalancerDNS",
            value=fargate_service.load_balancer.load_balancer_dns_name,
            description="Application Load Balancer DNS Name"
        )
        
        CfnOutput(
            self, "WebAppURL",
            value=f"http://{fargate_service.load_balancer.load_balancer_dns_name}",
            description="Web Application URL - Access this URL to view your app"
        )
        
        CfnOutput(
            self, "ECSClusterName",
            value=cluster.cluster_name,
            description="ECS Cluster Name for monitoring"
        )
        
        CfnOutput(
            self, "LogGroupName",
            value=log_group.log_group_name,
            description="CloudWatch Log Group Name for application logs"
        )