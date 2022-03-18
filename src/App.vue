<template>
  <div id="app">
    
    <router-view/>
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: "hiragino-kaku-gothic";
  src: url("~@/assets/fonts/Heisei Kaku Gothic Std W3.otf");

}
@font-face {
  font-family: "hiragino-kaku-gothic";
  src: url("~@/assets/fonts/Heisei Kaku Gothic Std W5.otf");
  font-weight: 500;
}
body {

  font-family: 'hiragino-kaku-gothic', Helvetica, Arial, Helvetica, sans-serif;

}
#app {
  font-family: 'hiragino-kaku-gothic', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
