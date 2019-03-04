<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Actividades</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Nueva</v-btn>
                        </template>
                            <v-card>
                                <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                                </v-card-title>
                    
                                <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="descripcion" label="Descripcion"></v-text-field>
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
                        <v-dialog v-model ="adModal" max-width="490">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">¿Finalizar actividad?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==0">¿Actividad pendiente?</v-card-title> 
                                <v-card-text>
                                    Estás a punto de cambiar la actividad "{{adNombre}}"
                                    <span v-if="adAccion==1"> quieres marcarla como Finalizada</span>
                                    <span v-if="adAccion==0"> quieres regresarla como Pendiente</span>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="green darken-1" flat="flat" @click="estadoFinalizadoPendienteCerrar">
                                        Cancelar
                                    </v-btn>
                                    <v-btn v-if ="adAccion==1" color="orange darken-4" flat="flat" @click="finalizada">
                                        Finalizar
                                    </v-btn>
                                    <v-btn v-if ="adAccion==0" color="orange darken-4" flat="flat" @click="pendiente">
                                        Pendiente
                                    </v-btn>

                                </v-card-actions>
                            
                            </v-card>
                        </v-dialog> 

                         <v-dialog v-model ="adModalEliminar" max-width="490">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">¿Eliminar actividad?</v-card-title>                                 
                                <v-card-text>
                                    Estás a punto de eliminar la actividad "{{adNombreEliminar}}"                                    
                                    <span > ¿Quieres Eliminarla?</span>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="green darken-1" flat="flat" @click="eliminarCerrar">
                                        Cancelar
                                    </v-btn>
                                    <v-btn color="orange darken-4" flat="flat" @click="eliminar">
                                        Eliminar
                                    </v-btn>

                                </v-card-actions>                            
                            </v-card>
                        </v-dialog> 
                
                </v-toolbar>
                <v-data-table
                    :headers="headers"
                    :items="actividades"
                    :search="search"
                    class="elevation-1"
                >
                    <template v-slot:items="props">
                        <td class="justify-center layout px-0">
                            <v-icon
                            small
                            class="mr-2"
                            @click="editItem(props.item)"
                            >
                            edit
                            </v-icon>
                            
                            <template v-if="props.item.finalizada">
                                <v-icon
                                small
                                class="mr-2"
                                @click="estadoFinalizadoPendiente(0,props.item)"
                                >
                                done
                                </v-icon>
                            </template>
                            <template v-else>
                                <v-icon
                                small
                                class="mr-2"
                                @click="estadoFinalizadoPendiente(1,props.item)"
                                >
                                schedule
                                </v-icon>
                            </template>

                            <v-icon
                            small
                            @click="deleteItem(props.item)"
                            >
                            delete
                            </v-icon>
                        </td>
                        <td>{{ props.item.nombre }}</td>
                        <td>{{ props.item.descripcion }}</td>

                        <td>
                            <div v-if="props.item.finalizada">
                                <span class="green--text">Finalizada</span>
                            </div>
                            <div v-else>
                                <span class="red--text">Pendiente</span>
                            </div>                          
                       </td>                       
                    
                    </template>
                    <template v-slot:no-data>
                    <v-btn color="primary" @click="listar">Reset</v-btn>
                    </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script> 
    import axios from 'axios'
    export default {
        data(){
            return{
                actividades:[],
                dialog: false,
                headers: [
                { text: 'Opciones', value: 'opciones', sortable: false },               
                { text: 'Nombre', value: 'nombre' },
                { text: 'Descripcion', value: 'descripcion', sortable: false },
                { text: 'Estado', value: 'finalizada' },                           
                ],
                search:'',               
                editedIndex: -1,               
                id: '',
                nombre:'',
                descripcion:'',
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:'',
                adModalEliminar:0,
                adNombreEliminar:'',
                adIdEliminar:'',
                logueadoId: this.$store.state.usuario.idusuario             
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nueva actividad' : 'Actualizar actividad'
            }
           
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {           
            this.listar();
        },
        methods:{
            listar(){
                let me= this;
                axios.get('api/Actividades/listar/'+me.logueadoId).then(function(response){
                    //console.log(response);
                    me.actividades = response.data;

                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.id = item.idactividad;
                this.nombre = item.nombre;
                this.descripcion = item.descripcion;   
                this.editedIndex = 1;           
                this.dialog = true;
            },
            deleteItem (item) {              

                this.adModalEliminar=1;
                this.adNombreEliminar=item.nombre;
                this.adIdEliminar = item.idactividad;
            },
            close(){
                this.dialog = false;
                this.limpiar();              
            },
            limpiar(){
                this.id ="";
                this.nombre = "";
                this.descripcion = "";
                this.editedIndex = -1;
            },
            guardar(){
                if(this.validar()){
                    return;
                }
                if (this.editedIndex > -1) {
                        let me = this;
                        axios.put('api/Actividades/Actualizar',{
                            'idactividad':me.id,
                            'nombre':me.nombre,
                            'descripcion':me.descripcion,                        
                        }).then(function(response){
                            me.close();
                            me.listar();
                            me.limpiar();
                        }).catch(function(error){
                            console.log(error);
                        });
                } else {                    
                        let me = this;
                        axios.post('api/Actividades/Crear',{
                            'nombre':me.nombre,
                            'descripcion':me.descripcion,
                            'idusuario':me.logueadoId
                        }).then(function(response){
                            me.close();
                            me.listar();
                            me.limpiar();                       
                        }).catch(function(error){
                            console.log(error);
                        });
                }            
            },
            validar(){
                this.valida = 0;
                this.validaMensaje = [];

                if(this.nombre.length < 6 || this.nombre.length > 50)
                {
                    this.validaMensaje.push("El nombre debe tener al menos 6 caracteres y no exceder los 50 caracteres.");
                }
                if(this.validaMensaje.length > 0)
                {
                    this.valida = 1;
                }
                return this.valida;
            },
            estadoFinalizadoPendiente(accion,item){
                this.adModal=1;
                this.adNombre=item.nombre;
                this.adId = item.idactividad;

                if(accion==1){
                    this.adAccion = 1;
                }
                else if(accion == 0)
                {
                    this.adAccion =0;
                }
                else{
                    this.adModal=0;
                }                
            },
            estadoFinalizadoPendienteCerrar(){
                this.adModal = 0;
            },
            finalizada(){
                let me = this;
                axios.put('api/Actividades/Finalizar/'+this.adId,{                    
                }).then(function(response){
                    me.adModal=0;
                    me.adAccion= 0;
                    me.adNombre="";
                    me.adId="";
                    me.listar();                        
                }).catch(function(error){
                    console.log(error);
                });
            },
            pendiente(){
                let me = this;
                axios.put('api/Actividades/Pendiente/'+this.adId,{                        
                }).then(function(response){
                    me.adModal=0;
                    me.adAccion= 0;
                    me.adNombre="";
                    me.adId="";
                    me.listar();                        
                }).catch(function(error){
                    console.log(error);
                });

            },
            eliminar(){
                let me = this;
                axios.delete('api/Actividades/Eliminar/'+this.adIdEliminar,{
                }).then(function(response){
                    me.adModalEliminar= 0;
                    me.adNombreEliminar="";
                    me.adIdEliminar="";
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                });
            },
            eliminarCerrar(){
                this.adModalEliminar = 0;
            }
        }
    }
</script>