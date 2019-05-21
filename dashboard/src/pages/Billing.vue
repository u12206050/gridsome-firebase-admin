<template>
  <Main>
    <div id="Billing">

      <el-button type="text" @click="cardDialog = true">Click to pay</el-button>

      <el-dialog :visible.sync="cardDialog" title="Enter your card details" width="380px">
        <card :class="{ complete }" :options="stripeOptions" class="stripe-card" stripe="pk_test_z2R0yG12v6flQu5SOhKoL2Ma" @change="complete = $event.complete"/>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cardDialog = false">Cancel</el-button>
          <el-button :disabled="!complete" type="primary" plain @click="pay">Pay $214</el-button>
        </span>
      </el-dialog>
    </div>
  </Main>
</template>

<script>
import { Card, createToken } from 'vue-stripe-elements-plus'

export default {
  name: 'Billing',
  components: { Card },
  data () {
    return {
      cardDialog: false,
      complete: false,
      stripeOptions: {
      }
    }
  },
  methods: {
    pay () {
      createToken().then(data => {
        console.log(data.token)
        this.cardDialog = false
      })
    }
  }
}
</script>

<style lang="scss">
.stripe-card {
  width: 300px;
  border: 1px solid #3BBA95;
}
.stripe-card.complete {
  border-color: #4caf50;
}
.StripeElement {
  background-color: #fff;
  padding: 10px;
}
</style>
