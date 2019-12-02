function myFunction() {
		var x = document.getElementsByName("name")[0].tagName;
		if (fs.existsSync('./uploads/'+x))
		{
			fs.unlinkSync('./uploads/'+x+'.txt');
		}
}