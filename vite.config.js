import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'pages/admin.html'),
        album: resolve(__dirname, 'pages/album.html'),
        fashionShow: resolve(__dirname, 'pages/fashion-show.html'),
        login: resolve(__dirname, 'pages/login.html'),
        signup: resolve(__dirname, 'pages/signup.html'),
        // cat-walk-admin HTMLs (all unique)
        adminLogin: resolve(__dirname, 'cat-walk-admin/htmls/admin-login.html'),
        addClothes: resolve(__dirname, 'cat-walk-admin/htmls/add-clothes.html'),
        addCats: resolve(__dirname, 'cat-walk-admin/htmls/add-cats.html'),
        userCatData: resolve(__dirname, 'cat-walk-admin/htmls/user-cat-data.html'),
        userClothesData: resolve(__dirname, 'cat-walk-admin/htmls/user-clothes-data.html'), // Fixed: renamed from duplicate userCatData
        users: resolve(__dirname, 'cat-walk-admin/htmls/users.html'),
        newNameClothes: resolve(__dirname, 'cat-walk-admin/htmls/new-name-clothes.html'),
        nameNewCat: resolve(__dirname, 'cat-walk-admin/htmls/name-new-cat.html'),
        messages: resolve(__dirname, 'cat-walk-admin/htmls/messages.html'),
        editClothes: resolve(__dirname, 'cat-walk-admin/htmls/edit-clothes.html'),
        editCat: resolve(__dirname, 'cat-walk-admin/htmls/edit-cat.html'),
        done: resolve(__dirname, 'cat-walk-admin/htmls/done.html'),
        clothesDatabase: resolve(__dirname, 'cat-walk-admin/htmls/clothes-database.html'),
        choseUser: resolve(__dirname, 'cat-walk-admin/htmls/chose-user.html'),
        chosenMessage: resolve(__dirname, 'cat-walk-admin/htmls/chosen-message.html'),
        catDatabase: resolve(__dirname, 'cat-walk-admin/htmls/cat-database.html'),
      },
      output: {
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'js/[name].js',
        entryFileNames: 'js/[name].js',
      },
    },
    assetsDir: 'assets',
  },
  publicDir: false, // assets are managed manually
  server: {
    port: 3000,
    open: 'index.html',
  }
});