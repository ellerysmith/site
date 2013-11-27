function initdoc()
{

    wrapper = document.getElementById('wrapper');

    var panes = initpanes();

    var cells = initcells();

    initpanepos(panes.parr);
    initgrads(cells);

    cellhandles(panes,cells);
    scripthandles();

    return;

}

function cell(cnv)
{

    this.cnv = cnv;

    this.ctx = cnv.getContext("2d");
    
    this.tmr = null;

    this.active = false;

    this.rad = 280;

}

function panes(parr)
{

    this.parr = parr;

    this.curr = 0;

    this.swp = 0;

}

function initcells()
{

    var cells = new Array();

    var cnvs = document.getElementsByClassName('bgs');

    for(var i = 0; i < cnvs.length; i++)
	cells[i] = new cell(cnvs[i]);

    return cells;

}

function initpanes()
{

    var parr = document.getElementsByClassName('panes');

    var paneobj = new panes(parr);

    return paneobj;

}

function cellhandles(panes, cells)
{

    var spans = document.getElementsByClassName('mtext');

    for(var i = 0; i < cells.length; i++)
    {

	(function(i){

	    spans[i].addEventListener("click",function(){switchpanes(panes,cells,i);})

	}(i));

	(function(i){

	    spans[i].addEventListener("mouseover",function(){gradfade(cells[i],1);})

	}(i));

	(function(i){

	    spans[i].addEventListener("mouseout",function(){gradfade(cells[i],-1);})

	}(i));

    }

    return;

}

function scripthandles()
{

    var scripts = document.getElementsByClassName('scripts');
    
    var expcol = document.getElementsByClassName('expcol');
    
    for(var i = 0; i < expcol.length; i++)
	(function(i){

	    expcol[i].addEventListener("click",function(){expandelem(scripts[i]);})

	}(i));
    

    return;

}

function initpanepos(panes)
{

    for(var i = 0; i < panes.length; i++)
    {

	panes[i].style.left = (wrapper.offsetWidth * i) + "px";

	panes[i].style.visibility = "visible";

    }

    return;

}

function initgrads(cells)
{

    var wdth = wrapper.offsetWidth / 4;
      
    for(var i = 0; i < cells.length; i++)
    {
	
	cells[i].cnv.width = wdth;
	cells[i].cnv.height = wrapper.offsetHeight * 0.08;
	
	paintgrad(cells[i].ctx,cells[i].rad,wdth/2);
	
    }

    gradfade(cells[0],1);

    cells[0].active = true;


    return;

}

function gradfade(cell, ofs)
{

    if(cell.active == true)
	return;
    
    clearInterval(cell.tmr);

    cell.tmr = setInterval(function(){gradswp(cell,ofs);},1);
    
    return;

}

function gradswp(cell, ofs)
{

    cell.rad += ofs;

    paintgrad(cell.ctx,cell.rad,wrapper.offsetWidth/8);

    if(cell.rad <= 280 || cell.rad >= 320)
	clearInterval(cell.tmr);

    return;

}

function paintgrad(ctx, r, xpos)
{

    var grd = ctx.createRadialGradient(xpos,400,r,xpos,400,370);
    
    grd.addColorStop(0,"#9090FF");
    grd.addColorStop(1,"#CCCCFF");
    
    ctx.fillStyle = grd;
    
    ctx.fillRect(0,0,500,500);


    return;

}

function expandelem(obj)
{

    obj.style.display = obj.style.display == "block" ? "none" : "block";

    return;

}

function switchpanes(panes, cells, paneid)
{

    if(panes.curr == paneid || panes.swp != 0)
	return;


    swapcells(cells, paneid);


    for(var i = 0; i < panes.parr.length; i++)
	(function(i)
	 {

	     var npos =  getlpos(panes.parr[i]) + ((panes.curr - paneid) * wrapper.offsetWidth);

	     panes.swp++;

	     var tmr = window.setInterval(function(){swipe(panes,i,tmr,npos);},5);

	 })(i);


    panes.curr = paneid;


    return;

}

function swapcells(cells, n)
{

    for(var i = 0; i < cells.length; i++)
    {

	if(cells[i].active == true)
	{
	    
	    cells[i].active = false;
	    gradfade(cells[i],-1);
	
	}
	
	cells[i].active = (i == n) ? true : false;

    }

    gradfade(cells[n],1);

    return;

}

function getlpos(obj)
{

    return parseInt(obj.style.left.substring(0,obj.style.left.length - 2));

}

function swipe(panes, i, tmr, lim)
{

    var d = getlpos(panes.parr[i]);
    
    if(d == lim)
    {
	
	clearInterval(tmr);
	
	panes.swp--;
	
	return;
	
    }
    
    else
    {

	var ofs = (lim < d ? -1 : 1) * Math.ceil(Math.abs(lim - d) * 0.03);

	panes.parr[i].style.left = (d + ofs) + "px";

	return;

    }

}

window.onload = initdoc();
