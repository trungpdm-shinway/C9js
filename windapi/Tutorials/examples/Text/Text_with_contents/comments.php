Within this example, we display a text component.<br><br>
var t = new <a href="<?php echo $documentation_path;?>/WIND.html" target="_blank">WIND</a>.<a href="<?php echo $documentation_path;?>/WIND.Text.html" target="_blank">Text</a>('<span id="param">text</span>', <span id="param">{'<span id="options">top</span>':50}</span>)<br>
First we create the text component.<br><br>
var p = t.<a href="<?php echo $documentation_path;?>/WIND.Text.html#createParagraph" target="_blank">createParagraph</a>();<br>
Then we create a <a href="<?php echo $documentation_path;?>/WIND.html" target="_blank">WIND</a>.<a href="<?php echo $documentation_path;?>/WIND.Text.html" target="_blank">Text</a>.<a href="<?php echo $documentation_path;?>/WIND.Text.Paragraph.html" target="_blank">Paragraph</a> object using <a href="<?php echo $documentation_path;?>/WIND.Text.html#createParagraph" target="_blank">createParagraph</a> method.<br><br>
Finally w set the paragraph's content with <a href="<?php echo $documentation_path;?>/WIND.Text.Paragraph.html#setContent" target="_blank">setContent</a> method.<br>
Notice that <a href="<?php echo $documentation_path;?>/WIND.Text.Paragraph.html#setContent" target="_blank">setContent</a> method overwrites the previous contents.