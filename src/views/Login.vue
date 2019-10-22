<template>
  <v-app id="vue-app-color">
    <div class="form-wrapper" id="Login">
      <v-form v-model="valid">
        <v-text-field label="Email" v-model="email" :rules="emailRules"></v-text-field>
        <v-text-field :type="'password'" label="Password" v-model="password" :rules="passwordRules"></v-text-field>
        <v-btn @click="submit" :disabled="!valid">Login</v-btn>
      </v-form>
      <br />
      <br />
      <br />
      <br />
      <br />
      <p>You are not logged in?</p>
      <br />
      <router-link to="signup">Sign up</router-link>
    </div>
  </v-app>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      valid: false,
      emailRules: [
        email => !!email || "Email is required",
        email =>
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
            email
          ) || "Email must be valid"
      ],
      passwordRules: [
        password => !!password || "Password is required",
        password =>
          /^([a-zA-Z0-9]{6,14})+$/.test(password) ||
          "The password must have uppercase and a size between 6 and 14 characters"
      ]
    };
  },
  methods: {
    submit() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            localStorage.setItem("user", this.email);
            this.$emit("validUser", true);
            this.$router.push({ path: "dependencies" });
          },
          error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
          }
        );
    }
  }
};
</script>

<style>
.form-wrapper {
  padding: 40px;
  text-align: center;
}

#Login {
  padding: 15% 25% 25% 25%;
  block-size: 100px;
}

#vue-app-color {
  background-color: white;
}
</style>