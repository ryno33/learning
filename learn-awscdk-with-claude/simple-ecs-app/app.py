#!/usr/bin/env python3
import os
from aws_cdk import App, Environment
from simple_ecs_web_app_stack import SimpleEcsWebAppStack

# CDKアプリケーションの作成
app = App()

# スタックの定義とデプロイ
SimpleEcsWebAppStack(
    app, "SimpleEcsWebAppStack",
    env=Environment(
        # AWS アカウントIDとリージョンを環境変数から取得
        account=os.getenv('CDK_DEFAULT_ACCOUNT'),
        region=os.getenv('CDK_DEFAULT_REGION', 'ap-northeast-1')  # デフォルトは東京リージョン
    ),
    description="Simple ECS Web Application for learning AWS CDK"
)

# CloudFormationテンプレートを生成
app.synth()