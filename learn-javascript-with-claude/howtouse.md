## ファイル構成

- fourpillars_runner.html - メインのHTMLページ（UI部分）
- fourPillarsAstrology.js - 四柱推命計算ライブラリ（ロジック部分）

## 使用方法

1. 両方のファイルを同じフォルダに保存してください

```
your-folder/
├── fourpillars_runner.html
└── fourPillarsAstrology.js
```

2. fourpillars_runner.html をダブルクリックしてブラウザで開く
3. 生年月日時を入力して「四柱推命を計算」ボタンをクリック

## 分割のメリット
- 再利用性: fourPillarsAstrology.js は他のプロジェクトでも使用可能
- 保守性: ロジックとUIが分離されているため、それぞれ独立してメンテナンス可能
- 可読性: コードが役割ごとに整理されて読みやすい
- 拡張性: 新しい機能を追加しやすい
