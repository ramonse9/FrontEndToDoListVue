<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      app
      v-if="logueado"
    >
      <v-list dense>
        <template>
          <v-list-tile :to="{name : 'inicio'}">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>
            Inicio
            </v-list-tile-title>
          </v-list-tile>
        </template>
        <template>
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  Opciones
                </v-list-tile-title>
              </v-list-tile-content>            
            </v-list-tile>

            <v-list-tile :to="{name : 'actividades'}">
              <v-list-tile-action>
                <v-icon>list</v-icon>
              </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Actividades
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          </v-list-group>
        </template>
        
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="blue darken-3"
      dark
      app
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">ToDo List</span>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      <v-btn @click="salir" v-if="logueado" icon>
        <v-icon>logout</v-icon>Salir
      </v-btn>
      <v-btn :to="{name: 'login'}" v-else>
        <v-icon>apps</v-icon>Login
      </v-btn>    
      
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>

      </v-container>
    </v-content>
    <v-footer dark height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat tile color="primary" class="white--text">
            <v-card-text class="white--text pt-0">
              Ramon Antonio Guzman Beltran &copy;2019
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>

  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      drawer:null
    }
  },
  computed:{
    logueado(){
      return this.$store.state.usuario;
    }
  },
  created(){
    this.$store.dispatch("autoLogin");
  },
  methods:{
    salir(){
      this.$store.dispatch("salir");
    }
  }
}
</script>
