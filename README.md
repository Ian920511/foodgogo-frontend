# 購物網站

![Index page about foodgogo-frontend](./public/images/首頁.PNG)

## 介紹

這是一個使用 Vue3 + Node.js + MySQL 打造的購物網站，主要提供瀏覽、篩選和排序商品、買家管理購物車商品、商家管理商品功能。

測試用帳號:
管理者:
account: admin@gmail.com
password: 123456

使用者:
account: user1@gmail.com
password: 123456

## https://ian920511.github.io/foodgogo/#/

## 功能

- 使用者需註冊會員並登入才能購物網站
  ![](./public/images/登入.PNG)
- 可以觀看全部商品
  ![](./public/images/商品頁面.PNG)
- 可以使用分類、關鍵字、金額範圍、價格排序等來查看及搜尋商品
  ![](./public/images/商品名稱跟金額.PNG)
- 賣家可以新增、刪除、修改商品資訊
  ![](./public/images/賣家商品處理.PNG)
- 買家可以新增、刪除、修改購物車內容
  ![](./public/images/購物車.PNG)
- 使用者可以在訂單資訊觀看訂單資訊
  ![](./public/images/訂單.PNG)

---

## 開始使用

1.先確認有安裝 node.js 與 npm

2.開啟終端機(Terminal)，clone 此專案

```bash
git clone https://github.com/Ian920511/foodgogo-frontend.git
```

3.初始化

```bash
cd foodgogo-frontend //進入存放檔案的資料夾
npm install  //安裝插件
```

4.完成後，輸入

```bash
npm run dev
```

5.啟動成功 frontend 會看到啟動的 Local 網址

6.可以使用以下帳號密碼進行登入測試

```bash
管理者:
account: admin@gmail.com
password: 123456

使用者:
account: user1@gmail.com
password: 123456
```

7.若需要暫停伺服器，則輸入

```bash
ctrl + c
```

---

## 規格

- 程式編輯器: [Visual Studio Code](https://visualstudio.microsoft.com/zh-hant/ 'Visual Studio Code')
- 使用框架: [Vue]
- 路由管理: [VueRouter]
- 使用者狀態管理: [pinia]

- 其他工具及版本請詳見 package.json
