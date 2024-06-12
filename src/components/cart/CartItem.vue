<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from './../../stores/cartStore'
import { useAlert } from './../../utils/alert'

const props = defineProps(['cartItem'])
const cartStore = useCartStore()
const { updateCartItem, deleteCartItem } = cartStore
const { cartItems, errorMessage } =  storeToRefs(cartStore)
const { showAlert } = useAlert()

const total = computed(() => {
  return props.cartItem.quantity * props.cartItem.product.price
})

const updateQuantity = (id, type) => {
  try {
    const cartItem = cartItems.value.find((item) => item.id === id)

    if (type === '-') {
      if (cartItem.quantity > 1) {
        cartItem.quantity --
      } else {
        return showAlert('warning', '數量不能小於1')
      }
    } else {
      cartItem.quantity ++
    }

    updateCartItem(id, cartItem.quantity)

  } catch (error) {
    showAlert('error', error)
  } 
}

const handleRemoveCartItem = (cartItemId) => {
  
  showAlert('warning', '確定要刪除商品嗎?', true).then((result) => {
    if (result.isConfirmed) {
      
      return deleteCartItem(cartItemId)
    }
    return
  })
}



</script>

<template>
  <tr class="border border-orange-400 text-center">
    <td>
      <button @click="handleRemoveCartItem(cartItem.id)">X</button>
    </td>
    <td>
      <img :src="cartItem.product.image" class="d-block mx-auto"  style="height: 80px; width: 80px; object-fit: cover;" :alt="cartItem.product.name" />
    </td>
    <td>
      {{ cartItem.product.name }}
    </td>
    <td>NT$ {{ cartItem.product.price }}</td>
    <td>{{ cartItem.product.stock }}</td>
    <td>
      <div class="flex items-center justify-center">
        <button @click="updateQuantity(cartItem.id, '-')">-</button>
        <input type="text" class="mx-1 cursor-pointer border border-primary text-center" :value="cartItem.quantity"
          @blur="(event) => updateCartItem(cartItem.id, Number(event.target.value))" />
        <button @click="updateQuantity(cartItem.id, '+')">+</button>
      </div>
    </td>
    <td>NT$ {{ total }}</td>
  </tr>
</template>