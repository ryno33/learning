# Simple ECS Web Application with AWS CDK
**注意**: このプロジェクトは学習目的で作成されています。
本番環境では追加のセキュリティ設定や冗長性の考慮が必要です。

Pythonのソースコードやjsonなど必要ファイルの生成にclaude.aiを利用しています。
- 利用モデル：Claude Sonnet 4
- 生成日：2025/08/11

## 概要
AWS CDKを使用してコスト最適化されたECS Fargateサービスを構築します。

## 全体アーキテクチャ

```
インターネット
    ↓
[Application Load Balancer]
    ↓
[ECS Fargate Service]
    ↓
[nginx:alpine Container]
    ↓
[CloudWatch Logs]
```

## 特徴
- **コスト最適化**: 最小CPU/メモリ、NATゲートウェイなし
- **セキュリティ**: 特定IPアドレスからのみアクセス可能
- **シンプル**: nginx:alpineコンテナで軽量
- **監視**: CloudWatch Logsでログ管理

## 推定月額料金
- **ECS Fargate**: 約$15-20（0.25vCPU, 512MB）
- **ALB**: 約$18-20
- **CloudWatch Logs**: 約$1-2
- **総計**: 約$35-45/月

## 前提条件

### 1. AWS CLI設定
```bash
aws configure
# AWS Access Key ID、Secret、Regionを設定
```

### 2. Node.js & CDK CLI
```bash
# Node.js (v14以上)
npm install -g aws-cdk

# CDKバージョン確認
cdk --version
```

### 3. Python環境
```bash
python3 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate.bat  # Windows

pip install -r requirements.txt
```

## セットアップ

### 1. IPアドレス設定
```bash
# 現在のパブリックIPを確認
curl https://ipinfo.io/ip

# app.pyのALLOWED_IPを更新
ALLOWED_IP = "YOUR_PUBLIC_IP/32"  # 例: "123.456.789.123/32"
```

### 2. CDK初期化（初回のみ）
```bash
cdk bootstrap
```

### 3. デプロイ
```bash
# 構成確認
cdk diff

# デプロイ実行
cdk deploy

# 確認プロンプトで 'y' を入力
```

## 使用方法

### アクセス
デプロイ完了後、出力されるURLにアクセス：
```
WebAppURL = http://SimpleE-LoadB-XXXXX.ap-northeast-1.elb.amazonaws.com
```

### ログ確認
```bash
# CloudWatch Logsでログ確認
aws logs describe-log-groups --log-group-name-prefix "/ecs/simple-web-app"
```

### リソース削除
```bash
# 料金節約のため使用後は削除
cdk destroy
```

## カスタマイズ

### アプリケーションの変更
独自のDockerイメージに変更する場合：

```python
# app.py内で変更
task_image_options=ecs_patterns.ApplicationLoadBalancedTaskImageOptions(
    image=ecs.ContainerImage.from_registry("your-image:tag"),
    container_port=8080,  # アプリのポート
    # ...
)
```

### リソースサイズの調整
```python
# より多くのリソースが必要な場合
cpu=512,  # 0.5 vCPU
memory_limit_mib=1024,  # 1GB
desired_count=2,  # 2インスタンス
```

## トラブルシューティング

### よくあるエラー

1. **"insufficient capacity"**
   ```bash
   # 別のAZを試す
   cdk destroy
   cdk deploy
   ```

2. **"security group rules"**
   ```bash
   # IPアドレスの形式確認
   # 例: "123.456.789.123/32" (/32 を忘れずに)
   ```

3. **"bootstrap required"**
   ```bash
   cdk bootstrap
   ```

### モニタリング
- ECS Cluster: AWS Console > ECS
- LoadBalancer: AWS Console > EC2 > Load Balancers
- CloudWatch: AWS Console > CloudWatch > Log groups

## セキュリティ考慮事項
- 特定IPのみアクセス可能
- パブリックサブネットのみ（NATゲートウェイ削減のため）
- CloudWatchでアクセスログ監視

## 学習記録

### 習得したスキル
- AWS CDK (Python) の環境構築
- AWS CDK を使った IaC によるリソース構築
    - ECS Fargate + ALB の構築
    - セキュリティグループ設定
    - CloudWatch Logs設定
- コスト最適化の考慮

### 学んだポイント
- CDKの自動生成Lambda関数の役割
- ALBとECSのセキュリティ設定の違い
- 手動操作とIaCの整合性管理
- IP制限によるアクセス制
- 生成AIへのプロンプト（stack.pyの修正依頼含む）

### 実際の課題と解決
- セキュリティグループのデフォルト設定問題
    - 初期アーティファクトに意図しないフルオープン設定が含まれていたため設定変更を依頼
- CDKバージョンによるAPI差異への対応
    - ローカル環境のバージョンを伝えることで python app.py 実行時のシンタックスエラーを修復
- npm権限エラーの解決
    - ローカル環境権限エラー解決のため専用ディクレトリをユーザ権限で再作成

### 推定学習時間
約3-4時間（環境構築、cdk deploy待機時間含む）

### 次のステップ案
- 独自Dockerイメージでのデプロイ
- RDSデータベース連携
- CI/CDパイプライン構築
