
var kittenimg1 = '<img class="img-responsive kittenimg" src="http://placekitten.com/400/250?image=1" srcset="http://placekitten.com/1140/720?image=1 1200w, http://placekitten.com/640/400?image=1 680w, http://placekitten.com/380/240?image=1 400w" sizes="(min-width: 1000px) 30vw, 90vw" alt="cutekitten">'
var kittenimg2 = kittenimg1.replace(/image=1/g,'image=2');
var kittenimg3 = kittenimg1.replace(/image=1/g,'image=3');
$(".img1")[0].onclick=function(){
	$(".kittenimg").remove();
	$(".modal-img").prepend(kittenimg1);
}
$(".img2")[0].onclick=function(){
	$(".kittenimg").remove();
	$(".modal-img").prepend(kittenimg2);
}
$(".img3")[0].onclick=function(){
	$(".kittenimg").remove();
	$(".modal-img").prepend(kittenimg3);
}