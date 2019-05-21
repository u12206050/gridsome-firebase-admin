<template>
  <div id="app" class="page-container md-layout-row">
    <el-container>
      <el-header class="secondary-theme main">
        <el-row type="flex" justify="space-between">
          <g-link to="/" style="height: 40px; display: inline-block">
            <g-image  src="~/assets/logo.svg" width="202px" height="40px" alt="CityFlow Logo" class="logo"></g-image>
          </g-link>
        </el-row>
      </el-header>

      <el-main style="position: relative">
        <transition name="fade" mode="out-in">
          <slot></slot>
        </transition>
      </el-main>

      <el-footer class="main">
        <el-row>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>
