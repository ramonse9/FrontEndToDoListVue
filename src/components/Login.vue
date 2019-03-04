<template>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 lg5 x14> 
            <v-card>
                <v-toolbar dark color="blue darken-3">
                    <v-toolbar-title>
                        Acceso a ToDO List
                    </v-toolbar-title>
                </v-toolbar>

                <v-card-text>
                    <v-text-field v-model="email" autofocus color="accent" label="Email" required>
                    </v-text-field>
                    <v-text-field v-model="password" type="password" color="accent" label="Password" required>
                    </v-text-field>
                    <v-flex class="red--text" v-if="error">
                        {{error}}
                    </v-flex>
                </v-card-text>
                <v-card-actions class="px-3 pb-3">
                    <v-flex text-xs-right>
                        <v-btn @click="ingresar" color="primary">Ingresar</v-btn>
                    </v-flex>


                     <v-dialog v-model="nuevo" max-width="500px">
                        
                            <v-card>
                                <v-card-title>
                                <span class="headline">Registrar Nuevo Usuario</span>
                                </v-card-title>
                    
                                <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="nombreNuevo" label="Nombre" required></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="emailNuevo" label="Email" required></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="passwordNuevo" type="password" label="Password" required></v-text-field>
                                    </v-flex>

                                    <v-flex xs12 sm12 md12 v-show="valida">
                                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                        </div>                                        
                                    </v-flex>
                                    
                                    </v-layout>
                                </v-container>
                                </v-card-text>
                    
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                                    <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>



                    <v-flex text-xs-right>
                        <v-btn @click="registrarse" color="primary">Registrarse</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
import axios from 'axios'

export default{    
    data(){
        return{
            valida:0,
            validaMensaje:[],
            nuevo:false,
            email:'',
            password:'',
            error:null,
            nombreNuevo:'',
            emailNuevo:'',
            passwordNuevo:''
        }
    },
    methods: {
        ingresar(){
            this.error=null;
            axios.post('api/Usuarios/Login',{email:this.email, password:this.password})
            .then(respuesta => {
                return respuesta.data
            })
            .then(data =>{
                this.$store.dispatch("guardarToken",data.token)
                this.$router.push({name:'inicio'})
            })
            .catch(err =>{
                console.log(err);
                if(err.response.status==400){
                    this.error="No es un email válido";
                }else if( err.response.status == 404){
                    this.error="No existe el usuario o sus datos son incorrectos";
                }else{
                    this.error="Ocurrió un error";
                }
            })
        },
        close(){
            this.nuevo = false;
            this.limpiar();              
        },
        limpiar(){    
            this.nombre = "";
            this.password ="";        
            this.nombreNuevo = "";
            this.emailNuevo = "";
            this.passwordNuevo = "";            
        },
        validar(){
            this.valida = 0;
            this.validaMensaje = [];

            if(this.nombreNuevo.length < 6 || this.nombreNuevo.length > 50)
            {
                this.validaMensaje.push("El nombre debe tener al menos 6 caracteres y no exceder los 50 caracteres.");
            }
            if(this.validaMensaje.length > 0)
            {
                this.valida = 1;
            }
            return this.valida;
        },
        registrarse(){
            this.nuevo = 1;
        },
        guardar(){
             if(this.validar()){
                    return;
                }               
            let me = this;
            axios.post('api/Usuarios/Crear',{
                'nombre':me.nombreNuevo,
                'email':me.emailNuevo,
                'password':me.passwordNuevo,                        
            }).then(function(response){
                me.close();               
                me.limpiar();
            }).catch(function(error){
                console.log(error);
            });
        }
    }
}
</script>
