<template>
	<div class="vis-superposicion">
		<div class="modal" v-if="controles_visibles">
			<div class="controles">
				<div class="control">
					<fieldset>
						<legend>Tipos de territorios</legend>
						<div class="toggle">
							<select v-model="tipo_data" class="selector">
								<option value="anps" > Áreas naturales protegidas </option>
								<option value="com_ind"> Comunidades indígenas </option>
								<option value="res_ind"> Reservas indígenas </option>
							</select>
						</div>
					</fieldset>
				</div>
				<div class="control">
					<fieldset>
						<legend>Paises</legend>
						<div class="toggle">
							<select v-model="pais_seleccionado" class="selector">
								<option v-for="(opt, i) in opciones_paises" :value="opt" :key="i"> 
									{{opt}} 
								</option>
								
							</select>
						</div>
					</fieldset>
				</div>
				<div class="control " v-if="opciones_regiones.length>=3">
					<fieldset>
						<legend>Departamento/Provincia</legend>
						<div class="toggle">
							<select v-model="region_seleccionada" class="selector">
								<option v-for="(opt, i) in opciones_regiones" :value="opt" :key="i"> 
									{{opt}} 
								</option>
								
							</select>
						</div>
					</fieldset>
				</div>
				<div class="control">
					<fieldset>
						<legend>Rango de traslape</legend>
						<div class="toggle">
							<select v-model="rango_traslape_seleccionado" class="selector">
								<option v-for="(opt, i) in opciones_traslapes" :value="opt" :key="i"> 
									{{opt}} 
								</option>
							</select>
						</div>
					</fieldset>
				</div>
				<button class="control" @click="controles_visibles = !controles_visibles">
					VER SELECCIÓN
				</button>
			</div>
		</div>
		
		<h1>SUPERPOSICIÓN DE LOTES PETROLEROS EN TERRITORIOS</h1>
		<p>Selecciona el tipo de fdafa  territorio y los países para ver los traslapes por porcentaje o superficie</p>
		<div class="ico-control">
			<div class="icono">
				<img v-if="tipo_data=='com_ind'" src="@/assets/img/comunidad.svg"/>
				<img v-if="tipo_data=='anps'" src="@/assets/img/anp.svg"/>
				<img v-if="tipo_data=='res_ind'" src="@/assets/img/reserva.svg"/>

			</div>
			<div class="controles">
				<div class="control">
					<fieldset>
						<legend>Tipos de territorios</legend>
						<div class="toggle">
							<select v-model="tipo_data" class="selector">
								<option value="anps" > Áreas naturales protegidas </option>
								<option value="com_ind"> Comunidades indígenas </option>
								<option value="res_ind"> Reservas indígenas </option>
							</select>
						</div>
					</fieldset>
				</div>
				<div class="control visible-escritorio">
					<fieldset>
						<legend>Paises</legend>
						<div class="toggle">
							<select v-model="pais_seleccionado" class="selector">
								<option v-for="(opt, i) in opciones_paises" :value="opt" :key="i"> 
									{{opt}} 
								</option>
								
							</select>
						</div>
					</fieldset>
				</div>
				<div class="control visible-escritorio" v-if="opciones_regiones.length>=3">
					<fieldset>
						<legend>Departamento/Provincia</legend>
						<div class="toggle">
							<select v-model="region_seleccionada" class="selector">
								<option v-for="(opt, i) in opciones_regiones" :value="opt" :key="i"> 
									{{opt}} 
								</option>
								
							</select>
						</div>
					</fieldset>
				</div>
				<div class="control visible-escritorio">
					<fieldset>
						<legend>Rango de traslape</legend>
						<div class="toggle">
							<select v-model="rango_traslape_seleccionado" class="selector">
								<option v-for="(opt, i) in opciones_traslapes" :value="opt" :key="i"> 
									{{opt}} 
								</option>
							</select>
						</div>
					</fieldset>
				</div>
				<div class="control nomenclatura visible-escritorio">
					<div v-for="(pais, i) in Object.keys(colores)" :key="i">
						<span :style="{background: colores[pais]}"></span>{{pais}}
					</div>
				</div>
			</div>

		</div>
		<button class="control visible-movil" @click="controles_visibles = !controles_visibles">
			VER TODOS LOS CONTROLES
		</button>
		
		<BarrasPetroleras
			:datos="data_componente_filtrada"
		>
		</BarrasPetroleras>
		<div class="control nomenclatura visible-movil">
			<div v-for="(pais, i) in Object.keys(colores)" :key="i">
				<span :style="{background: colores[pais]}"></span>{{pais}}
			</div>
		</div>
	</div>
</template>
<script>
import * as d3 from "d3";
import BarrasPetroleras from "@/components/BarrasPetroleras.vue";
export default {
	name:"VisTraslapes",
	components:{
		BarrasPetroleras,
	},
	data(){
		return {
			colores: {
                "Colombia": "#FFB700",
                "Perú": "#D20015",
                "Bolivia": "#006528",
                "Ecuador": "#003C86"
            },
			data_anps: Array,
			data_com_ind: Array,
			data_res_ind: Array,
			
			data_componente: [],
			
			tipo_data: "anps",
			pais_seleccionado: "Todos los paises",
			opciones_paises: [],

			region_seleccionada: "Todas las regiones",
			opciones_regiones: [],
			controles_visibles: false,

			rango_traslape_seleccionado: "0-100%",
			opciones_traslapes: ["0-100%", "0-20%", "20-40%","40-60%","60-80%","80-100%"] 
		}
	},
	beforeMount(){
		this.data_componente_filtrada = []
	},
	watch: {
		tipo_data(nv){
			if(nv == "anps"){
				this.data_componente = [...this.data_anps];
			}
			else if(nv == "com_ind"){
				this.data_componente = [...this.data_com_ind];
			}
			else if(nv == "res_ind"){
				this.data_componente = [...this.data_res_ind];
			}
			//Selector paises
            this.pais_seleccionado = "Todos los paises";
            this.opciones_paises = [...new Set(["Todos los paises"].concat(this.data_componente.map(d => d.pais )))];
            //Selector regiones
            this.region_seleccionada = "Todas las regiones";
            this.opciones_regiones = [...new Set(["Todas las regiones"].concat(this.data_componente.map(d => d.region )))];
			this.data_componente_filtrada = [...this.data_componente.sort((a, b) => b.interseccion_porc - a.interseccion_porc)]
		},
		pais_seleccionado(){
            this.filtrandoBarras()
        },
        region_seleccionada(){
            this.filtrandoBarras()
        },
        rango_traslape_seleccionado(){
            this.filtrandoBarras()
        },

	},
	updated(){
		this.filtrandoBarras();
	},
	mounted(){
		d3.csv("intersecciones_anps.csv").then((data) => {
			data.forEach((d)=>{
				d.interseccion_ha = +d.interseccion_ha;
				d.interseccion_porc = +d.interseccion_porc;
			})
			this.data_anps = data;
			this.data_componente = [...data].sort((a, b) => b.interseccion_porc - a.interseccion_porc);
			this.data_componente_filtrada = [...data].sort((a, b) => b.interseccion_porc - a.interseccion_porc)

			//Selector paises
            this.pais_seleccionado = "Todos los paises";
            this.opciones_paises = [...new Set(["Todos los paises"].concat(this.data_componente.map(d => d.pais )))];
            //Selector regiones
            this.region_seleccionada = "Todas las regiones";
            this.opciones_regiones = [...new Set(["Todas las regiones"].concat(this.data_componente.map(d => d.region )))];

		});
		d3.csv("intersecciones_com_ind.csv").then((data) => {
			data.forEach((d)=>{
				d.interseccion_ha = +d.interseccion_ha;
				d.interseccion_porc = +d.interseccion_porc;
				d.region = d.region!=" " ? d.region.toUpperCase(): "SIN INFORMACIÓN"
			})
			this.data_com_ind = data.sort((a, b) => b.interseccion_porc - a.interseccion_porc);
		});
		d3.csv("intersecciones_res_ind.csv").then((data) => {
			data.forEach((d)=>{
				d.interseccion_ha = +d.interseccion_ha;
				d.interseccion_porc = +d.interseccion_porc;
				d.region = d.region? d.region.toUpperCase(): "SIN INFORMACIÓN"

			})
			this.data_res_ind = data.sort((a, b) => b.interseccion_porc - a.interseccion_porc);
		});
	},
	methods: {
		filtrandoBarras(){
            this.data_componente_filtrada = this.data_componente
                .filter((d) => (this.pais_seleccionado == "Todos los paises" ? true : d.pais == this.pais_seleccionado))
                .filter((d) => (this.region_seleccionada == "Todas las regiones" ? true : d.region == this.region_seleccionada))
                .filter((d) => {
                    let eff = this.rango_traslape_seleccionado.replaceAll("%","").split("-");
                    return (d.interseccion_porc > parseInt(eff[0]) && d.interseccion_porc <= parseInt(eff[1]))
                })

        },
	}
}
</script>
<style lang="scss">
$border-radius: 6px;
.vis-superposicion{
    max-width: 1480px;
    margin: 0 auto;
	.modal{
		z-index: 1;
		position: absolute;
		//background: rgba(240,240,240, .9);
		width: calc(100% );
		backdrop-filter: blur(30px);
		-webkit-backdrop-filter: blur(30px);
		margin: -8px;
		background: rgba(0, 10, 43, .2) 0% 0% no-repeat padding-box;
		border-radius: 0 0 4px 4px;
		color:#000A2B;
		.control{
			display: block;
			width: 250px;
			text-align: center;
			margin: 10px auto;
			select{
				font-size: 14px;
				border-radius: $border-radius;
				padding: 6px 6px;
				min-width: 100%;
				background: #fff;
			}
		}
		button.control{
			background: #000A2B;
			color: #FFFFFF;
		}

		@media( min-width: 764px ) {
				display: none;
			
			
		}
	}

	h1{
		color: #000A2B;
		font-size: 21px;
		text-align: left;
		line-height: 1.1;
		@media( max-width: 764px ) {
			font-size: 18px;
			margin-bottom: 0;
		}
	}
	p{
		color: #2B332B;
		font-size: 16px;
		text-align: left;
		margin: 5px 0 0 0;
		@media( max-width: 764px ) {
			font-size: 14px;
			margin-top: 0;
		}
	}
	fieldset {
		padding: 5px 15px 15px 0;
		border:none;
		legend {
			width:100%;
			text-align: left;
		}
		
	}
	.ico-control{
		display: flex;

		.icono{
			flex: 1 1 122px;
			max-width: 150px;
			display: flex;
			img{
				
				width: 60px;
				margin:  10px auto auto auto
			}
		}
		.controles{
		display: flex;
		flex-wrap: wrap;
		.toggle{
			box-sizing: border-box;
			display: flex;
			flex-flow: row nowrap;
			justify-content: flex-start;
			align-items: stretch;
			select{
				border: 1px solid #000A2B;
				text-transform: uppercase;
				font-size: 14px;
				border-radius: $border-radius;
				padding: 6px 6px;
				min-width: 100%;
				background: #fff;

			}
			
		}
		@media( min-width: 764px ) {
	
			&.visible-movil{
				display: none;
			}
		}
		@media( max-width: 764px ) {
			&.visible-escritorio{
				display: none;
			}
			
		}
		
	}
		
	}
	
}
button.control{
	width: calc(100% - 30px);
	text-align: center;
	margin: 10px auto;
	display: block;
	background: #fff;
	border: 1px solid #000A2B;
	text-transform: uppercase;
	font-size: 14px;
	border-radius: $border-radius;
	padding: 6px 6px;
}
.control{
	display: flex;
	flex-wrap: wrap;

	div{
		margin-top: 5px;
		display: flex;
		text-transform: uppercase;
		font-size: 14px;
		span{
			width: 36px;
			height: 18px;
			margin: 0 10px;
			border-radius: 4px;
		
		}
	}
	&.nomenclatura{
		div{
			margin-top: 5px;
			display: flex;
			text-transform: uppercase;
			font-size: 14px;
			margin: 5px 0;
			span{
				width: 36px;
				height: 18px;
				margin: 0 10px;
				border-radius: 4px;
			}
		}
	}

	@media( min-width: 764px ) {
	
		&.visible-movil{
			display: none;
		}
	}
	@media( max-width: 764px ) {
		&.visible-escritorio{
			display: none;
		}
		
	}
}

</style>