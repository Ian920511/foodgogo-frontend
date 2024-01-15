<!-- <template>
  <section class="position-relative">
    <img src="./../../assets/section.jpg" alt="圖片" style="height: 40vh; object-fit: cover;">
  </section>
</template> -->

<template>
  <section class="position-relative">
    <div class="image-container">
      <img src="./../../assets/section.jpg" alt="圖片">
    </div>
  </section>
</template>

<style>
.position-relative {
  position: relative;
  height: 40vh;
  overflow: hidden;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

img {
  height: 100%;
  width: auto;
  object-fit: cover;
}</style>