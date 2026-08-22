# Examples

Live demos from the `examples/` folder. Each example opens in a new tab.

<style style="display: none;">
.examples-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:16px;
  margin:24px 0;
}
.ex-card{
  display:flex;
  flex-direction:column;
  gap:6px;
  padding:18px 16px;
  border:1px solid #3d3838;
  background:#1a1718;
  border-radius:10px;
  text-decoration:none !important;
  color:inherit !important;
  transition:border-color .15s, transform .15s, background .15s;
}
.ex-card:hover{
  border-color:#fff;
  transform:translateY(-2px);
  background:#1e1c1c;
}
.ex-num{
  font-family:monospace;
  font-size:11px;
  letter-spacing:.08em;
  color:#fff;
  opacity:.9;
}
.ex-card h3{
  margin:0 !important;
  font-size:15px !important;
  color:#f2eded !important;
  display: none;
}
.ex-card p{
  margin:0 !important;
  font-size:13px;
  line-height:1.5;
  color:#b8b2b2 !important;
}
.ex-open{
  margin-top:6px;
  font-size:12px;
  font-weight:600;
  color:#fff;
}
.ex-card:hover .ex-open{ text-decoration:underline; }
</style>

<div class="examples-grid">

<a class="ex-card" href="examples/01-hello-world/" target="_blank" rel="noopener">
  <div class="ex-num">01 — HELLO WORLD</div>
  <h3>Hello World</h3>
  <p>Minimal first component. Render a value from <code>data</code>.</p>
  <span class="ex-open">Open →</span>
</a>

<a class="ex-card" href="examples/02%20-%20nested-components/" target="_blank" rel="noopener">
  <div class="ex-num">02 — NESTED</div>
  <h3>Nested Components</h3>
  <p>Parent → child → grand-child composition.</p>
  <span class="ex-open">Open →</span>
</a>

<a class="ex-card" href="examples/03-lifecycle/" target="_blank" rel="noopener">
  <div class="ex-num">03 — LIFECYCLE</div>
  <h3>Lifecycle</h3>
  <p>Log of lifecycle hooks and state/prop updates.</p>
  <span class="ex-open">Open →</span>
</a>

<a class="ex-card" href="examples/04-parent-trigger/" target="_blank" rel="noopener">
  <div class="ex-num">04 — PARENT TRIGGER</div>
  <h3>Parent Trigger</h3>
  <p>Child triggers a parent update via callbacks.</p>
  <span class="ex-open">Open →</span>
</a>

<a class="ex-card" href="examples/05-props/" target="_blank" rel="noopener">
  <div class="ex-num">05 — PROPS</div>
  <h3>Props</h3>
  <p>String/object props via <code>attr</code> / <code>.prop</code> and <code>objToPropString</code>.</p>
  <span class="ex-open">Open →</span>
</a>

<a class="ex-card" href="examples/06-stress-test/" target="_blank" rel="noopener">
  <div class="ex-num">06 — STRESS TEST</div>
  <h3>Stress Test</h3>
  <p>Reactive style stress test with many updates.</p>
  <span class="ex-open">Open →</span>
</a>

<a class="ex-card" href="examples/07-long-template/" target="_blank" rel="noopener">
  <div class="ex-num">07 — LONG TEMPLATE</div>
  <h3>Long Template</h3>
  <p>Performance test with a very large template.</p>
  <span class="ex-open">Open →</span>
</a>

<a class="ex-card" href="examples/08-go/" target="_blank" rel="noopener">
  <div class="ex-num">08 — GO / ROUTER</div>
  <h3>Router</h3>
  <p>Client-side routing examples with <code>go</code>.</p>
  <span class="ex-open">Open →</span>
</a>

<a class="ex-card" href="examples/10-todo/" target="_blank" rel="noopener">
  <div class="ex-num">10 — TODO</div>
  <h3>Todo App</h3>
  <p>Todo list with <code>each</code>, <code>.checked</code> and reactive data.</p>
  <span class="ex-open">Open →</span>
</a>

</div>

> Electron example lives in `examples/09-electron/` — run with `npm start` inside that folder.

> Chrome extension example lives in `examples/11-chrome/` — load it unpacked from `chrome://extensions` (Developer mode → Load unpacked).

---

Want to play freely? Use the [Playground](docs/playground.md).