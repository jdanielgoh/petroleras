<template>
<div id="vis-barras">
    <div class="controles">
        <div class="control">
            <fieldset>
                <legend>Tipos de territorios</legend>
                <slot name="selector"></slot>
            </fieldset>
        </div>
        <div class="control">
            <fieldset>
                <legend>Ver</legend>
                <div class="toggle">
                    <input type="radio" id="interseccion_porc" value="interseccion_porc" v-model="vista">
                    <label for="interseccion_porc">%</label>
                    <input type="radio" id="interseccion_ha" value="interseccion_ha" v-model="vista">
                    <label for="interseccion_ha">Ha</label>
                </div>
            </fieldset>
        </div>
        <div class="control">
            <fieldset>
                <legend>Ordenar</legend>
                <div class="toggle">
                    <input type="radio" id="descendente" value="descendente" v-model="orden">
                    <label for="descendente">&#8595;</label>
                    <input type="radio" id="ascendente" value="ascendente" v-model="orden">
                    <label for="ascendente">&#8593; </label>
                </div>
            </fieldset>
        </div>
        <div class="control">
            <fieldset>
                <legend>Agrupar barras</legend>
                <div class="toggle">
                    <input type="radio" id="general" value="general" v-model="agrupamiento">
                    <label for="general">General</label>
                    <input type="radio" id="por_pais" value="por_pais" v-model="agrupamiento">
                    <label for="por_pais">Por país </label>
                </div>
            </fieldset>
        </div>

    </div>
    <div id="contenedor-svg">
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
        datos: Array
    },
    data(){
        return {
            vista: "interseccion_porc",
            orden: "descendente",
            agrupamiento: "general",
            lista_paises: ["Bolivia","Colombia", "Ecuador", "Perú"],
            margen: {
                arriba: 20,
                abajo: 20,
                derecha: 20,
                izquierda: 80
            },
            alto_vis: 500,
            ancho_vis: 3000,
            colores: {
                "Colombia": "cyan",
                "Perú": "blue",
                "Bolivia": "yellow",
                "Ecuador": "red"
            }
        }
    },
    mounted(){
        this.svg = d3.select("div#contenedor-svg svg#svg-barras");
        this.grupo_contenedor = this.svg.select("g.grupo-contenedor-barras");
        this.eje_y = this.grupo_contenedor
            .append("g")
            .attr("class","eje-y");
            
        this.eje_x = this.grupo_contenedor
            .append("g")
            .attr("class","eje-x");
        this.configurandoDimensionesParaSVG();
        this.configurandoDimensionesParaBarras();
        this.creandoBarras();

    },
    watch:{
        datos(){
            this.grupo_contenedor.selectAll("rect.rects").remove()
            this.configurandoDimensionesParaSVG()
            this.configurandoDimensionesParaBarras();
            this.creandoBarras();
            this.actualizandoBarras()
            this.reordenandoBarras();
        },
        vista(){
            this.configurandoDimensionesParaBarras();
            this.actualizandoBarras();  
            this.reordenandoBarras()
        },
        orden(){
            this.reordenandoBarras()
        },
        agrupamiento(){
            this.reordenandoBarras()
        }
    },
    methods: {
        configurandoDimensionesParaSVG(){
            this.ancho_vis = this.datos.length * 30
            this.width = this.ancho_vis - this.margen.izquierda- this.margen.derecha;
            this.height = this.alto_vis - this.margen.arriba - this.margen.abajo;
            this.svg
                .attr("width", this.width + this.margen.derecha + this.margen.izquierda)
                .attr("height", this.height + this.margen.arriba + this.margen.abajo);
            this.grupo_contenedor
                .attr("transform", `translate(${this.margen.izquierda},${this.margen.arriba})`)
        },
        configurandoDimensionesParaBarras(){
            this.escalaY = d3.scaleLinear()
                .domain([0, d3.max(this.datos.map((d)=>d[this.vista]))])
                .range([0, this.height]);
            this.escalaX = d3.scaleBand()
                .domain(d3.range(this.datos.length))
                .range([0,this.width])
                .padding(.1)
            this.eje_y
                .transition()
                .duration(500)
                .call(d3.axisLeft(this.escalaY).ticks(4));
            this.eje_x.transition().duration(100).call(d3.axisTop(this.escalaX))
                .attr("transform","translate(0,"+0+")")
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
                .attr("height", (d) => this.escalaY(d[this.vista])) 
        },
        reordenandoBarras(){
            this.barras
                .sort((a, b) => {
                    if(this.orden == "descendente") return  d3.descending(a[this.vista], b[this.vista]) 
                    else return d3.ascending(a[this.vista], b[this.vista])
                })
                .sort((a, b) => {
                    if(this.agrupamiento == "por_pais") return  d3.descending(a.pais, b.pais) 
                    //else return d3.ascending(a[this.vista], b[this.vista])
                })

                .transition()
                .delay(300)
                .duration(500)
                .attr("x", (d, i) => this.escalaX(i))
                .attr("height", (d) => this.escalaY(d[this.vista])) 
            console.log(this.barras._groups[0].map(e => e.__data__))

        }

    }
}
</script>

<style lang="scss">
$teal2: pink;
$border-radius: 6px;
fieldset {
    border:none;
    legend {
        width:100%;
        text-align: left;
    }
    select.selector{
        padding: 5px 10px; 
        border-radius: $border-radius;
        font-size: 14px; 
        font-weight: 600; 
        background: $teal2;
        border: none;

    }
}
.controles{
    display: flex;
    .toggle{
        box-sizing: border-box;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: stretch;
        input {
            display:none;
        }
        input + label {
            margin: 0; 
            padding: 5px 10px; 
            box-sizing: border-box;
            position: relative; 
            display: inline-block;
            border: solid 1px #bbb; 
            background-color: #FFF;
            font-size: 14px; 
            font-weight: 600; 
            text-align: center;
            box-shadow: 0 0 0 rgba(255,255,255,0);
            transition: border-color .15s ease-out, 
                color .25s ease-out, 
                background-color .15s ease-out,
                box-shadow .15s ease-out;
            &:first-of-type {border-radius: $border-radius 0 0 $border-radius; border-right: none;}
            &:last-of-type {border-radius: 0 $border-radius $border-radius 0; border-left: none;}
        }
        input:checked + label {
            background-color: $teal2;
            color: #FFF;
            border-color: $teal2;
            z-index: 1;
        }
    }
}
</style>