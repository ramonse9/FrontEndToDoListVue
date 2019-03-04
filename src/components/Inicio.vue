<template>
  
  <div>       
    <v-card-title class="headline" >Bienvenid@ {{logueadoNombre}} a ToDo List</v-card-title> 
        <v-card-text>
            Esta es una pequeña aplicacion web para llevar un control de tus actividades, está hecha con VueJs y Vuetify.
        </v-card-text>  

        <v-divider class="my-3"></v-divider>     

        <v-list-tile :to="{name : 'actividades'}">            
                <v-icon>list</v-icon>                      
                <v-list-tile-title >
                    <span class="blue--text">
                        Ir a tus Actividades
                    </span>
                </v-list-tile-title>            
        </v-list-tile>



  </div>

</template>

<script>
    export default {
        data(){
            return{             
                logueadoNombre: this.$store.state.usuario.nombre, 
                prueba: 'probando'             
            }
        }        
    }
</script>
