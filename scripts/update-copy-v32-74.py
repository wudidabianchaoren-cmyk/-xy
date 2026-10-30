from pathlib import Path
P=Path(__file__).resolve().parents[1]
p=P/'v31.html';s=p.read_text(encoding='utf8')
if './v32-74.css' not in s:s=s.replace('  <script type="importmap">','  <link rel="stylesheet" href="./v32-74.css?v=32.74">\n  <script type="importmap">')
a=s.index('      <article class="image-chapter research-board');b=s.index('\n      </article>',a)+len('\n      </article>')
s=s[:a]+'''      <article class="image-chapter research-board is-lab" data-separate-research="v32-74">
        <div class="research-board-heading"><small>READ &amp; LEARN</small><h2>阅读与学习</h2><p>读一些书，也给新的尝试留一点位置。</p></div>
        <div class="research-portals"><a class="research-portal" href="./reading.html"><small>01 / READING ROOM</small><h3>书架里的电影美学</h3><p>把这本书翻开，慢慢看。原来的图像和排版都保留在页里。</p><span>进入书架 ↗</span></a><a class="research-portal" href="./learning.html"><small>02 / LEARNING NOTES</small><h3>学习，慢慢来</h3><p>这里会放制作过程中读到的东西和练习。内容正在整理。</p><span>进入学习页 ↗</span></a></div>
      </article>'''+s[b:]
s=s.replace('工具会进化，<br>判断要由我来做。','跟上变化，<br>也留住自己的感受。')
s=s.replace('我做这个作品集，<br>是为了让脑海中的世界，成为可以被走近的体验。','我想试着学会这些新工具，<br>也想把喜欢的画面和故事，认真做出来。')
a=s.index('        <div class="epilogue-body">');b=s.index('</div>',a)+6
s=s[:a]+'''        <div class="epilogue-body"><p>做这个作品集，一开始是因为不想错过 AI 带来的变化。我想知道，原本只停在脑海里的画面，能不能借助新的工具，变成一段影像、一个可以走近的空间。</p><p>做着做着，我也发现，工具能帮我试得更快，但许多细节还是要慢慢看、反复改。一个人的姿态、一束光照到哪里、一张图片停留多久，都会影响看的人有什么感受。这里留下的，既有我喜欢的想象，也有还在学习的痕迹。</p><p>我希望自己能跟上这个时代，也不丢掉对日常生活的好奇。继续读书、观察，学着把一个小想法做完整。如果你在这里停了一会儿，看见了一个喜欢的画面，或者想起了一件自己的小事，我会很开心。谢谢你来看。</p></div>'''+s[b:]
s=s.replace('EPILOGUE / STILL BECOMING','A NOTE / THANK YOU FOR VISITING').replace('A NOTE TO THE AGE OF AI','写在最后').replace('THE ARCHIVE ENDS HERE. CURIOSITY CONTINUES.','THANK YOU. SEE YOU IN THE NEXT IDEA.')
p.write_text(s,encoding='utf8')
p=P/'v31-motion.js';s=p.read_text(encoding='utf8');needle='      const index = [...list.querySelectorAll(".index-work")].indexOf(button);\n      closeIndex(event);'
s=s.replace(needle,"      const label=button.querySelector('.title')?.textContent.trim();\n      if(label==='阅读'||label==='学习') { closeIndex(event); location.href=label==='阅读'?'./reading.html':'./learning.html';return; }\n"+needle)
needle='    trigger.dataset.v31IndexRepair = "true";'
s=s.replace(needle,needle+"\n    for(const button of list.querySelectorAll('.index-work')) if(['实验','关于'].includes(button.querySelector('.title')?.textContent.trim()))button.remove();\n    for(const button of nav.querySelectorAll('button'))if(['实验','关于'].includes(button.querySelector('span:last-child')?.textContent.trim()))button.remove();")
p.write_text(s,encoding='utf8')
print('Separate reading and learning portals; warm modest closing; experiment/about removed')
