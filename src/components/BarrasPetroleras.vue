<template>
<div :id="barras_apiladas_id" >
   
    <div id="contenedor-svg" class="contenedor-tooltip-svg">
        <div class="tooltip"> 
            <div class="tooltip-contenido">
                <div class="contenedor-boton-cerrar">
                    <button class="boton-cerrar-tooltip" @click="cerrarTooltip">
                        &times;
                    </button>
                </div>
                <div class="tooltip-cifras">120 | <b> 29.3%<b></b></b></div>
            </div>
        </div>

        <svg id ="svg-barras">
            <g class="grupo-contenedor-barras">

            </g>
        </svg>
    </div>
</div>
    
</template>
<script>
import * as d3 from "d3"

export default {
    name: "BarrasPetroleras",
    props:{
        datos: Array,
    },
    data(){
        return {
            barras_apiladas_id: "vis-barras",
            vista: "interseccion_porc",
            orden: "descendente",
            agrupamiento: "general",
            lista_paises: ["Bolivia","Colombia", "Ecuador", "Perú"],
            margen: {
                arriba: 20,
                abajo: 20,
                derecha: 20,
                izquierda: 55
            },
            ancho_tooltip: 300,
            alto_vis: 350,
            ancho_vis: 3000,
            colores: {
                "Colombia": "#FFB700",
                "Perú": "#D20015",
                "Bolivia": "#006528",
                "Ecuador": "#003C86"
            },
           
        }
    },
    mounted(){
        this.svg = d3.select("div#contenedor-svg svg#svg-barras");
        this.grupo_contenedor = this.svg.select("g.grupo-contenedor-barras");
        this.eje_y = this.grupo_contenedor
            .append("g")
            .attr("class","eje-y");
        this.tooltip = d3.select("div#"+this.barras_apiladas_id)
			.select("div.tooltip");

    },
    watch:{
        datos(){
            this.grupo_contenedor.selectAll("rect.rects").remove()
            this.configurandoDimensionesParaSVG()
            this.configurandoDimensionesParaBarras();
            this.creandoBarras();
            this.actualizandoBarras()
        },

    },
    methods: {
        
        
        configurandoDimensionesParaSVG(){
            this.ancho_vis = this.datos.length * 30 + this.margen.izquierda + this.margen.derecha;
            this.width = this.ancho_vis - this.margen.izquierda- this.margen.derecha;
            this.height = this.alto_vis - this.margen.arriba - this.margen.abajo;
            this.svg
                .attr("width", this.width + this.margen.derecha + this.margen.izquierda)
                .attr("height", this.height + this.margen.arriba + this.margen.abajo)
                .attr("viewBox", [0, 0, this.width + this.margen.derecha + this.margen.izquierda, this.height + this.margen.arriba + this.margen.abajo]);
            this.grupo_contenedor
                .attr("transform", `translate(${this.margen.izquierda},${this.margen.arriba})`);
            /*const extent = [[this.margen.izquierda, this.margen.arriba], [this.ancho_vis - this.margen.derecha, this.height - this.margen.arriba]];
            this.svg.call(d3.zoom()
                .scaleExtent([1, 8])
                .translateExtent(extent)
                .extent(extent)
                .on("zoom", this.zoomed)
            )*/
        },
        zoomed(event){
            this.escalaX.range([0, this.width].map(d => event.transform.applyX(d)));
            this.barras.attr("x", (d, i) => this.escalaX(i)).attr("width", this.escalaX.bandwidth());
        },
        configurandoDimensionesParaBarras(){
            this.escalaY = d3.scaleLinear()
                .domain([0, d3.max(this.datos.map((d)=>d.interseccion_porc))])
                .range([0, this.height]);
            this.escalaX = d3.scaleBand()
                .domain(d3.range(this.datos.length))
                .range([0,this.width])
                .padding(.1)
            this.eje_y
                .transition()
                .duration(500)
                .call(d3.axisLeft(this.escalaY).ticks(4).tickFormat((d) => d+"%"))
                .attr("transform","translate(0,"+0+")");
            this.eje_y.select("path.domain").remove();
            this.eje_y.selectAll("g.tick line")
                .attr("x1",this.width)
                .style("stroke-dasharray", "3 3")
            
                

            
        },
        
        creandoBarras(){
            this.barras = this.grupo_contenedor
                .selectAll("rects")
                .data(this.datos)
                .enter()
                .append("rect") 
                .attr("class","rects")
                .style("fill", d=> this.colores[d.pais])
            
        },
        actualizandoBarras(){
            this.barras
                .attr("x", (d, i) => this.escalaX(i))
                .attr("y", this.escalaY(0))
                .attr("width", this.escalaX.bandwidth)
                .transition()
                .duration(200)
                .attr("height", (d) => this.escalaY(d.interseccion_porc)) 
            this.svg
                .on("mousemove", (evento) => {
                    
                        this.mostrarTooltip(evento)
                    
                })
                .on('mouseout', () => {
                        if(window.innerWidth>768){
                            this.cerrarTooltip()
                        }
                })

        },
        mostrarTooltip(evento){
				var eachBand = this.escalaX.step();
				var index = parseInt(((evento.layerX - this.margen.izquierda - this.margen.derecha) / eachBand));
				var categoria = this.escalaX.domain()[index];
				var a = this.datos[categoria];
				var pos_left_scroleada = document.querySelector("div#"+this.barras_apiladas_id+" div.contenedor-tooltip-svg")
					.scrollLeft
				this.tooltip.style("visibility","visible")
				this.tooltip
					.style("left",evento.layerX-pos_left_scroleada<.5 * parseInt(d3.select(`div#${this.barras_apiladas_id}`).style("width")) ? (evento.layerX +10)+"px":(evento.layerX-this.ancho_tooltip -20 )+"px" )
					.attr("width",this.ancho_tooltip)
					.attr("height",30 )
				
				let contenido_tooltip = this.tooltip.select("div.tooltip-contenido")
					.style("background","rgba(0, 0, 0,.8)")
					.style("min-width",this.ancho_tooltip +"px")
					.style("border-radius","8px")
					.style("width",this.ancho_tooltip+"px")
					.attr("height",70 )
					.style("padding","0 3px 0 10px");
				
				this.svg.select("button.boton-cerrar-tooltip")
					.on("click",this.cerrarTooltip)
				


				contenido_tooltip
					.select("div.tooltip-cifras")
					.html(
                        `<p>País: <b>${a.pais}</b></p>
                        ${a.region ? "<p>Departamento/Provincia: <b>" + a.region + "</b></p>":""}
                        <p>Nombre del territorio: <b>${a.nombre}</b></p>
                        <p>Nombre del lote: <b>${a.lote_petrolero}</b></p>
                        <p>Área de traslape: <b>${a.interseccion_ha} hectáreas</b></p>
                        <p>Porcentaje de traslape: <b>${a.interseccion_porc}%</b></p>
                        `
                        )
				this.tooltip
					.style("height",contenido_tooltip.style("height"))
					.style("width",contenido_tooltip.style("width") )
					.style("top",this.margen.arriba+"px")
					
				// Colores a barras
				this.barras
					.style("fill","#767676")
				this.barras
					.filter((d,i) => i == categoria)
					.style("fill",(d) => this.colores[d.pais])
                    
			},
			cerrarTooltip() {
				this.tooltip.style('visibility', 'hidden')
				this.barras
					.style("fill",(d) => this.colores[d.pais])

			},

        

    }
}
</script>

<style scoped lang="scss">
$teal2: pink;
$border-radius: 6px;

#contenedor-svg{
    width: 100%;
    position: relative;
    overflow-x: scroll;
    div.tooltip {
        color:#fff;
        font-size: 12px;
        position: absolute;
        z-index: 2;
        visibility: hidden;        
    }
    div.tooltip::v-deep 
        div.tooltip-cifras{
            padding-bottom:5px;
            p{
                color: #fff;
                margin: 0 0 5px 0;
            }

    }
    div.tooltip::v-deep 
        .contenedor-boton-cerrar{
            button{
                background: transparent;
                color: #fff;
                border: none;
                font-size: 35px;
                margin-top: 16px;
                line-height: .1;
            }
            text-align: right;

    }
}

</style>