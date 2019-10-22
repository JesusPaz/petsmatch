<template>
  <div id="Dependencies">
    <v-app id="vue-app-color">
      <v-form ref="form" v-model="valid" class="mb-12 mt-12">
        <h3>Create a new dependency</h3>
        <v-text-field label="Name" v-model="newDependency.name" :rules="nameRules"></v-text-field>
        <v-select v-model="newDependency.coordinator" :items="userIds" label="Coordinator"></v-select>

        <v-text-field
          label="Max Number of Users"
          v-model="newDependency.maxnumber"
          :rules="numberRules"
        ></v-text-field>
        <v-text-field label="Location" v-model="newDependency.location" :rules="locRules"></v-text-field>
        <v-select v-model="newDependency.active" :items="ops" label="Enabled"></v-select>

        <v-btn @click="addDependency" :disabled="!valid">Submit</v-btn>
      </v-form>

      <h3>All dependencies</h3>

      <v-card class="mt-6 mb-12">
        <v-card-title>
          <v-text-field v-model="search" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table
          :search="search"
          :headers="headers"
          :items="deps"
          item-key="name"
          show-expand
          class="elevation-1"
        >
          <template v-slot:top></template>
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
            <v-icon small @click="deleteItem(item)">delete</v-icon>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">{{item.users.toString()}}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import { db } from "./db";

export default {
  name: "Dependencies",
  data() {
    return {
      valid: false,
      search: "",
      headers: [
        { text: "Name", value: "name" },
        { text: "Coordinator", value: "coordinator" },
        { text: "Max Number", value: "maxnumber" },
        { text: "Location", value: "location" },
        { text: "Enabled", value: "active" },
        { text: "Actions", value: "action", sortable: false },
        { text: "", value: "data-table-expand", sortable: false }
      ],
      ops: ["True", "False"],
      deps: [],
      userIds: [],
      newDependency: {
        name: "",
        coordinator: "",
        maxnumber: "",
        location: "",
        active: "",
        users: []
      },
      editedIndex: -1,
      editedItem: {
        name: "",
        coordinator: "",
        maxnumber: "",
        location: "",
        active: "",
        users: []
      },
      deletedItem: {
        name: "",
        coordinator: "",
        maxnumber: "",
        location: "",
        active: "",
        users: []
      },
      defaultItem: {
        name: "",
        coordinator: "",
        maxnumber: "",
        location: "",
        active: "",
        users: []
      },
      nameRules: [
        name => !!name || "Name is required",
        name => name.length > 3 || "Name must be longer than 4 chars"
      ],
      cordRules: [
        coordinator => !!coordinator || "Coordinador is required",
        coordinator =>
          coordinator.length > 3 || "Coordinador must be longer than 4 chars"
      ],
      locRules: [
        location => !!location || "Location is required",
        location =>
          location.length > 3 || "Location must be longer than 4 chars"
      ],
      numberRules: [
        maxnumber => !!maxnumber || "Max Number is required",
        maxnumber =>
          /^([0-9])+$/.test(maxnumber) || "Max Number need to be a integer"
      ]
    };
  },
  mounted() {
    this.getDeps();
    this.getUserIds();
  },
  computed: {
    items: function() {
      return this.deps;
    }
  },
  methods: {
    addDependency() {
      db.collection("dependencies")
        .doc(this.newDependency.name)
        .set(this.newDependency)
        .then(function() {
          alert("Dependency successfully added!");
        })
        .catch(function(error) {
          alert("Error writing document: ", error);
        });

      this.newDependency.name = "";
      this.newDependency.coordinator = "";
      this.newDependency.maxnumber = "";
      this.newDependency.location = "";
      this.newDependency.active = "";
    },
    async getDeps() {
      await db
        .collection("dependencies")
        .get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
            this.deps.push(doc.data());
          });
        });
    },
    async getUserIds() {
      await db
        .collection("users")
        .get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
            this.userIds.push(doc.data().name);
          });
        });
    },
    editItem(item) {
      this.editedIndex = this.deps.indexOf(item);
      this.newDependency = Object.assign({}, item);
    },

    deleteItem(item) {
      const index = this.deps.indexOf(item);
      this.deletedItem = Object.assign({}, item);
      if (confirm("Are you sure you want to delete this item?")) {
        this.deps.splice(index, 1);

        db.collection("dependencies")
          .doc(this.deletedItem.name)
          .delete()
          .then(function() {
            //alert("Document successfully deleted!");
          })
          .catch(function(error) {
            alert("Error removing document: ", error);
          });
      }
    }
  }
};
</script>
<style>
#vue-app-color {
  background-color: white;
}
</style>