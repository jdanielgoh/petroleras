<template>
	<div class="about">
		
		<h1>SUPERPOSICIÓN DE LOTES PETROLEROS EN TERRITORIOS</h1>
		<p>Selecciona el tipo de territorio y los países para ver los traslapes por porcentaje o superficie</p>
		
		<BarrasPetroleras
			:datos="data_componente"
		>
			<template slot="selector" >
				<select v-model="tipo_data" class="selector">
					<option value="anps" > Áreas naturales protegidas </option>
					<option value="com_ind"> Comunidades indígenas </option>
					<option value="res_ind"> Reservas indígenas </option>
				</select>
			</template>
		</BarrasPetroleras>
	</div>
</template>
<script>
import * as d3 from "d3";
import BarrasPetroleras from "@/components/BarrasPetroleras.vue";
export default {
	name:"VisPetroleras",
	components:{
		BarrasPetroleras,
	},
	data(){
		return {
		data_anps: Array,
		data_com_ind: Array,
		data_res_ind: Array,
		data_componente: [],
		tipo_data: "anps"
		}
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
		}
	},
	mounted(){
		d3.csv("intersecciones_anps.csv").then((data) => {
			data.forEach((d)=>{
				d.interseccion_ha = +d.interseccion_ha;
				d.interseccion_porc = +d.interseccion_porc;
			})
			this.data_anps = data;
			this.data_componente = [...data];
		});
		d3.csv("intersecciones_com_ind.csv").then((data) => {
			data.forEach((d)=>{
				d.interseccion_ha = +d.interseccion_ha;
				d.interseccion_porc = +d.interseccion_porc;
			})
			this.data_com_ind = data;
		});
		d3.csv("intersecciones_res_ind.csv").then((data) => {
			data.forEach((d)=>{
				d.interseccion_ha = +d.interseccion_ha;
				d.interseccion_porc = +d.interseccion_porc;
			})
			this.data_res_ind = data;
		});
	}
}
</script>
