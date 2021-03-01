<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank"
             rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa" target="_blank"
             rel="noopener">pwa</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router" target="_blank"
             rel="noopener">router</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank"
             rel="noopener">eslint</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript" target="_blank"
             rel="noopener">typescript</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a>
      </li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
    <ul>
      <button v-on:click="testCart">test 1</button>
      <button v-on:click="addQty">Add</button>
      <button v-on:click="reduceQty">reduce</button>
      <button v-on:click="addQty1">Add 1</button>
      <button v-on:click="reduceQty1">reduce 1</button>
    </ul>
    <br><br>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import { SingleShopCart } from '@/logic/cart/SingleShopCart';
  import { Order } from '@/module/interface/Order';
  import {ApiHelper} from "@/api/ApiHelper";
  import { Product } from '@/module/Product';

  @Component
  export default class HelloWorld extends Vue {
    @Prop() private msg!: string;
    private apiHelper = ApiHelper.getInstance();
    private orderId: number | undefined;
    private p: Product | undefined;
    private p1: Product | undefined;

    async placeOrder(){
      try{
        var items =  [{"product_id":"592407","qty":"1","row_total":"17.97","options":[],"note":"Test note"},
          {"product_id":"592404","qty":"1","row_total":"17.97","options":[]}]
        var disId = [592425]
        var contact = {"name":"潘舒","tel":6479891678,"addr":"50 Acadia Ave"}
        var order: Order ={
          shop_id: 15457,
          shipping_fee: 48.16,
          shipping_distance:5,
          contact: JSON.stringify(contact),
          items: JSON.stringify(items),
          comment: 'ahhahahahaahah',
          shipping_type:"delivery",
          payment_type:"cashpay",
          subtotal:40,
          promotion_code:"FS367024",
          tips: 4.5,
          discount_product_ids: JSON.stringify(disId),
        }
        // var response = await this.apiHelper.placeOrder(order)
        // alert("place order successful and order id is " + response.data.data.order_id)
        // this.orderId = response.data.data.order_id.toString();
      }catch (e) {
        alert("order Failed" + e)
      }
    }

    testCart(){
      var cart = SingleShopCart.getInstance();
      var respones = "{\n" +
        "\t\"products\": [{\n" +
        "\t\t\t\"product_id\": 592404,\n" +
        "\t\t\t\"product_name\": \"韭菜虾仁素包（蒸包）\",\n" +
        "\t\t\t\"product_image\": \"\",\n" +
        "\t\t\t\"product_desc\": null,\n" +
        "\t\t\t\"price\": 6.99,\n" +
        "\t\t\t\"org_price\": 6.99,\n" +
        "\t\t\t\"options\": [],\n" +
        "\t\t\t\"position\": -10000,\n" +
        "\t\t\t\"max\": 0,\n" +
        "\t\t\t\"stock\": -9999,\n" +
        "\t\t\t\"discount\": 5.99,\n" +
        "\t\t\t\"discount_price\": 1,\n" +
        "\t\t\t\"discount_limit_times\": 3\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\t\"product_id\": 592405,\n" +
        "\t\t\t\"product_name\": \"韭菜虾仁素包（煎包）\",\n" +
        "\t\t\t\"product_image\": \"\",\n" +
        "\t\t\t\"product_desc\": null,\n" +
        "\t\t\t\"price\": 6.99,\n" +
        "\t\t\t\"org_price\": 6.99,\n" +
        "\t\t\t\"options\": [],\n" +
        "\t\t\t\"position\": -10000,\n" +
        "\t\t\t\"max\": 0,\n" +
        "\t\t\t\"stock\": -9999,\n" +
        "\t\t\t\"discount\": 5.99,\n" +
        "\t\t\t\"discount_price\": 1,\n" +
        "\t\t\t\"discount_limit_times\": 3\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\t\"product_id\": 592406,\n" +
        "\t\t\t\"product_name\": \"鲜肉白菜包（蒸包）\",\n" +
        "\t\t\t\"product_image\": \"\",\n" +
        "\t\t\t\"product_desc\": \"\",\n" +
        "\t\t\t\"price\": 5.99,\n" +
        "\t\t\t\"org_price\": 5.99,\n" +
        "\t\t\t\"options\": [],\n" +
        "\t\t\t\"position\": -10000,\n" +
        "\t\t\t\"max\": 0,\n" +
        "\t\t\t\"stock\": -9999,\n" +
        "\t\t\t\"discount\": 4.99,\n" +
        "\t\t\t\"discount_price\": 1,\n" +
        "\t\t\t\"discount_limit_times\": 3\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\t\"product_id\": 592408,\n" +
        "\t\t\t\"product_name\": \"小笼包\",\n" +
        "\t\t\t\"product_image\": \"\",\n" +
        "\t\t\t\"product_desc\": null,\n" +
        "\t\t\t\"price\": 6.99,\n" +
        "\t\t\t\"org_price\": 6.99,\n" +
        "\t\t\t\"options\": [],\n" +
        "\t\t\t\"position\": -10000,\n" +
        "\t\t\t\"max\": 0,\n" +
        "\t\t\t\"stock\": -9999,\n" +
        "\t\t\t\"discount\": 5.99,\n" +
        "\t\t\t\"discount_price\": 1,\n" +
        "\t\t\t\"discount_limit_times\": 3\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\t\"product_id\": 592409,\n" +
        "\t\t\t\"product_name\": \"鲜肉茴香包\",\n" +
        "\t\t\t\"product_image\": \"\",\n" +
        "\t\t\t\"product_desc\": null,\n" +
        "\t\t\t\"price\": 5.99,\n" +
        "\t\t\t\"org_price\": 5.99,\n" +
        "\t\t\t\"options\": [],\n" +
        "\t\t\t\"position\": -10000,\n" +
        "\t\t\t\"max\": 0,\n" +
        "\t\t\t\"stock\": -9999,\n" +
        "\t\t\t\"discount\": 4.99,\n" +
        "\t\t\t\"discount_price\": 1,\n" +
        "\t\t\t\"discount_limit_times\": 3\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\t\"product_id\": 592425,\n" +
        "\t\t\t\"product_name\": \"鲜肉韭菜蒸饺\",\n" +
        "\t\t\t\"product_image\": \"\",\n" +
        "\t\t\t\"product_desc\": \"\",\n" +
        "\t\t\t\"price\": 5.99,\n" +
        "\t\t\t\"org_price\": 5.99,\n" +
        "\t\t\t\"options\": [{\n" +
        "\t\t\t\t\t\"label\": \"规格\",\n" +
        "\t\t\t\t\t\"type\": \"radio\",\n" +
        "\t\t\t\t\t\"status\": 1,\n" +
        "\t\t\t\t\t\"items\": [{\n" +
        "\t\t\t\t\t\t\t\"name\": \"珍珠\",\n" +
        "\t\t\t\t\t\t\t\"price\": 0.5,\n" +
        "\t\t\t\t\t\t\t\"checked\": 0,\n" +
        "\t\t\t\t\t\t\t\"max\": 5,\n" +
        "\t\t\t\t\t\t\t\"status\": 1\n" +
        "\t\t\t\t\t\t},\n" +
        "\t\t\t\t\t\t{\n" +
        "\t\t\t\t\t\t\t\"name\": \"椰果\",\n" +
        "\t\t\t\t\t\t\t\"price\": 0.5,\n" +
        "\t\t\t\t\t\t\t\"checked\": 0,\n" +
        "\t\t\t\t\t\t\t\"max\": 5,\n" +
        "\t\t\t\t\t\t\t\"status\": 1\n" +
        "\t\t\t\t\t\t},\n" +
        "\t\t\t\t\t\t{\n" +
        "\t\t\t\t\t\t\t\"name\": \"仙草\",\n" +
        "\t\t\t\t\t\t\t\"price\": 0.5,\n" +
        "\t\t\t\t\t\t\t\"checked\": 0,\n" +
        "\t\t\t\t\t\t\t\"max\": 5,\n" +
        "\t\t\t\t\t\t\t\"status\": 1\n" +
        "\t\t\t\t\t\t}\n" +
        "\t\t\t\t\t],\n" +
        "\t\t\t\t\t\"min\": 1,\n" +
        "\t\t\t\t\t\"max\": 1\n" +
        "\t\t\t\t},\n" +
        "\t\t\t\t{\n" +
        "\t\t\t\t\t\"label\": \"规格\",\n" +
        "\t\t\t\t\t\"type\": \"radio\",\n" +
        "\t\t\t\t\t\"status\": 1,\n" +
        "\t\t\t\t\t\"items\": [{\n" +
        "\t\t\t\t\t\t\t\"name\": \"大杯\",\n" +
        "\t\t\t\t\t\t\t\"price\": 0,\n" +
        "\t\t\t\t\t\t\t\"checked\": 0,\n" +
        "\t\t\t\t\t\t\t\"max\": 1,\n" +
        "\t\t\t\t\t\t\t\"status\": 1\n" +
        "\t\t\t\t\t\t},\n" +
        "\t\t\t\t\t\t{\n" +
        "\t\t\t\t\t\t\t\"name\": \"大杯\",\n" +
        "\t\t\t\t\t\t\t\"price\": 0,\n" +
        "\t\t\t\t\t\t\t\"checked\": 0,\n" +
        "\t\t\t\t\t\t\t\"max\": 1,\n" +
        "\t\t\t\t\t\t\t\"status\": 1\n" +
        "\t\t\t\t\t\t}\n" +
        "\t\t\t\t\t],\n" +
        "\t\t\t\t\t\"min\": 1,\n" +
        "\t\t\t\t\t\"max\": 1\n" +
        "\t\t\t\t},\n" +
        "\t\t\t\t{\n" +
        "\t\t\t\t\t\"label\": \"规格\",\n" +
        "\t\t\t\t\t\"type\": \"radio\",\n" +
        "\t\t\t\t\t\"status\": 1,\n" +
        "\t\t\t\t\t\"items\": [{\n" +
        "\t\t\t\t\t\t\t\"name\": \"大杯\",\n" +
        "\t\t\t\t\t\t\t\"price\": 0,\n" +
        "\t\t\t\t\t\t\t\"checked\": 0,\n" +
        "\t\t\t\t\t\t\t\"max\": 1,\n" +
        "\t\t\t\t\t\t\t\"status\": 1\n" +
        "\t\t\t\t\t\t},\n" +
        "\t\t\t\t\t\t{\n" +
        "\t\t\t\t\t\t\t\"name\": \"大杯\",\n" +
        "\t\t\t\t\t\t\t\"price\": 0,\n" +
        "\t\t\t\t\t\t\t\"checked\": 0,\n" +
        "\t\t\t\t\t\t\t\"max\": 1,\n" +
        "\t\t\t\t\t\t\t\"status\": 1\n" +
        "\t\t\t\t\t\t}\n" +
        "\t\t\t\t\t],\n" +
        "\t\t\t\t\t\"min\": 1,\n" +
        "\t\t\t\t\t\"max\": 1\n" +
        "\t\t\t\t}\n" +
        "\t\t\t],\n" +
        "\t\t\t\"position\": -10000,\n" +
        "\t\t\t\"max\": 8,\n" +
        "\t\t\t\"stock\": -9999,\n" +
        "\t\t\t\"discount\": 4.99,\n" +
        "\t\t\t\"discount_price\": 1,\n" +
        "\t\t\t\"discount_limit_times\": 3\n" +
        "\t\t}\n" +
        "\t]\n" +
        "}"
      var productList: Product[] = JSON.parse(respones).products
      productList.map(p=> p.qty =0 );

      productList[5].qty = 1;
      this.p = productList[5]
      productList[1].qty = 1;
      this.p1 = productList[1];

      // cart.setUpCart(343534)
    }

    addQty(){
      var cart = SingleShopCart.getInstance();
      // cart.addToCart(this.p)
      // console.log(cart.getCart()[0] ? cart.getCart()[0].qty : "kong")


    }

    reduceQty(){
      var cart = SingleShopCart.getInstance();
      // cart.reduceProductQuantity(this.p)
      // console.log(cart.getCart()[0] ? cart.getCart()[0].qty : "kong")

    }

    addQty1(){
      var cart = SingleShopCart.getInstance();
      // cart.addToCart(this.p1)
      // console.log(cart.getCart()[0] ? cart.getCart()[0].qty : "kong")
      console.log(JSON.stringify(cart.getCart()))
    }

    reduceQty1(){
      var cart = SingleShopCart.getInstance();
      // cart.reduceProductQuantity(this.p1)
      // console.log(cart.getCart()[0] ? cart.getCart()[0].qty : "kong")
      console.log(JSON.stringify(cart.getCart()))
    }


  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
