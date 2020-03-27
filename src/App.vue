<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
    <notifications
      group="store"
      position="bottom right"
      :ignore-duplicates="true"
    />
  </div>
</template>

<style lang="scss">
@import 'styles/index.scss';
</style>
