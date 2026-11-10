// 礼物（第二个，第 16 天）。照 ../礼物.py 一行一行搬，test/对.py 逐串对。
var LW_WIN = ['缎带', '手套', '梳子', '表链', '领子'];
var LW_DESC = {
  '缎带': '缎带铺，窗里挂着一卷蓝缎带，标着六毛',
  '手套': '手套铺，一副男式皮手套，标着一块八',
  '梳子': '那家橱窗，一套玳瑁梳子，边上镶着小石头，标着三十块',
  '表链': '首饰铺，一条白金表链，样子素净，标着二十一块',
  '领子': '皮货铺，一条兔毛领子，标着七块五'
};
var LW_PRICE = {'缎带': 0.6, '手套': 1.8, '梳子': 30, '表链': 21, '领子': 7.5};
var LW_HERS = ['缎带', '梳子', '领子'];
var LW_COLD = {2: 1, 4: 1, 5: 1};
var LW_SAVE = 8;
var LW_DATES = ['12 月 18 日', '12 月 19 日', '12 月 20 日', '12 月 21 日', '12 月 22 日', '12 月 23 日'];

function lwNew() {
  return {day: 1, phase: '走', stops: [], score: {'缎带': 0, '梳子': 1, '领子': 0}, decided: false,
    glove: 0, selfGlove: false, last: {'缎带': -1, '梳子': -1, '领子': -1}, tick: 0, sellNights: 0,
    week: [], money: 1.87, hair: true, gift: null, out: []};
}

function lwP(s, t) { s.out.push(t === undefined ? '' : t); }

function lwCount(arr, x) { var n = 0; for (var i = 0; i < arr.length; i++) if (arr[i] === x) n++; return n; }

function lwTarget(s) {
  // 跟 python 的 max(key=(分, 最近)) 一样：并列时取先出现的
  var best = LW_HERS[0];
  for (var i = 1; i < LW_HERS.length; i++) {
    var w = LW_HERS[i];
    if (s.score[w] > s.score[best] || (s.score[w] === s.score[best] && s.last[w] > s.last[best])) best = w;
  }
  return best;
}

function lwMenu(s) {
  if (s.phase === '走') return LW_WIN.map(function (w) { return '看' + w; }).concat(['回家']);
  if (s.phase === '卖') return ['卖头发', '不卖'];
  if (s.phase === '买') {
    var r = [];
    ['手套', '表链'].forEach(function (w) { if (LW_PRICE[w] <= s.money + 1e-9) r.push('买' + w); });
    r.push('不买');
    return r;
  }
  return [];
}

function lwStartNight(s) {
  var d = s.day;
  lwP(s, '—— ' + LW_DATES[d - 1] + '，晚上 ——');
  if (d === 1) {
    lwP(s, '你叫黛拉。你数了三遍：一块八毛七。再过一个礼拜就是圣诞，你想给吉姆买一样配得上他的东西。');
    lwP(s, '吉姆一礼拜挣二十块。他有一块金表，是他爷爷传给他父亲、他父亲传给他的，拴着一根旧皮绳。你有一头长到膝盖底下的头发。');
    lwP(s, '百老汇那家橱窗里有一套玳瑁梳子，你看了好几个月了。');
    lwP(s, '');
  }
  lwP(s, '吉姆下了班，你们一起走百老汇回家。');
  if (LW_COLD[d]) lwP(s, '今晚风大。吉姆没有手套，两只手冻得通红，揣在大衣兜里。');
  if (d === 1) lwP(s, '路上有五个橱窗：' + LW_WIN.map(function (w) { return LW_DESC[w]; }).join('；') + '。');
  else lwP(s, '又路过那五个橱窗：缎带、手套、梳子、表链、领子。');
}

function lwStop(s, w) {
  s.tick += 1;
  var n = lwCount(s.stops, w);
  s.stops.push(w);
  if (LW_HERS.indexOf(w) >= 0) {
    s.score[w] += 1;
    s.last[w] = s.tick;
    if (n === 0) lwP(s, '你在' + w + '那个橱窗前站住了。吉姆顺着你的眼睛看过去，看了一会儿橱窗，又看了看你。');
    else lwP(s, '你又在' + w + '前多站了一会儿。吉姆没催你，也在看。');
  } else if (w === '表链') {
    if (n === 0) lwP(s, '你在首饰铺前站住了，看那条表链。吉姆往窗里瞟了一眼，手往他自己兜里的表上按了按。');
    else lwP(s, '你又看了一会儿表链。吉姆把手揣进兜里，往前走了半步等你。');
  } else {
    s.glove += 1;
    if (s.glove === 1) lwP(s, '你在手套铺前站住了。吉姆瞟了一眼，把眼睛挪开了。');
    else if (s.glove === 2) lwP(s, '你又在手套铺前站住了。吉姆说：“我不冷。”');
    else lwP(s, '你看着那副手套。吉姆也看了一眼，看的是价签。');
  }
  if (s.stops.length >= 4) {
    lwP(s, '天黑透了。吉姆说，回家吧。');
    lwGoHome(s);
  }
}

function lwGoHome(s) {
  var d = s.day;
  if (LW_COLD[d] && s.stops.indexOf('手套') < 0) lwP(s, '路过手套铺的时候，吉姆慢了一步，又跟上来。');
  var anyHers = false;
  for (var i = 0; i < s.stops.length; i++) if (LW_HERS.indexOf(s.stops[i]) >= 0) anyHers = true;
  if (anyHers || d >= 4) s.decided = true;
  if (s.glove >= 2) s.selfGlove = true;
  var t = lwTarget(s);
  var sell = s.decided && LW_PRICE[t] > LW_SAVE;
  if (sell) s.sellNights += 1; else s.sellNights = 0;
  lwP(s, '到家了。你煎了肉排。');
  var line;
  if (!s.decided) line = '吃过饭，吉姆侧过身去掏出表，看了一眼钟点，揣回去了。表上拴的还是那根旧皮绳。';
  else if (!sell) line = '吃过饭，吉姆侧过身去掏出表，看了一眼钟点，揣回去了。' + (s.selfGlove ? '睡前他坐在床边把零钱分成两小堆，数了两遍。' : '睡前他坐在床边数兜里的零钱，数了两遍。');
  else if (s.sellNights === 1) line = '吃过饭，吉姆掏出表，看了很久，没看钟点。';
  else if (s.sellNights === 2) line = '吃过饭，吉姆把表搁在桌上，拿袖子擦了擦表壳。';
  else line = '吃过饭，吉姆把表搁在桌上，上了弦，听了一会儿它走。';
  if (s.selfGlove) line += !(s.decided && !sell) ? '睡前他把兜里的零钱分成了两小堆。' : '';
  if (s.week.length && s.week[s.week.length - 1][2] === line) lwP(s, '吃过饭，跟昨晚一样，' + line.slice(4));
  else lwP(s, line);
  s.week.push([LW_DATES[d - 1], s.stops.slice(), line]);
  s.stops = [];
  s.day += 1;
  lwP(s, '');
  if (s.day <= 6) lwStartNight(s);
  else {
    s.phase = '卖';
    lwP(s, '—— 12 月 24 日，平安夜 ——');
    lwP(s, '吉姆上班去了。你又数了一遍：一块八毛七。明天就是圣诞。');
    lwP(s, '你把头发放下来，在窗间那面窄镜子前站了一会儿。街那头有一家铺子挂着牌子：收购各种头发。');
  }
}

function lwAct(s, a) {
  if (lwMenu(s).indexOf(a) < 0) { lwP(s, '（这会儿不能“' + a + '”。）'); return; }
  if (s.phase === '走') {
    if (a === '回家') { lwP(s, s.stops.length ? '你们回家了。' : '你们一路没停，回家了。'); lwGoHome(s); }
    else lwStop(s, a.slice(1));
  } else if (s.phase === '卖') {
    if (a === '卖头发') {
      s.hair = false;
      s.money += 20;
      lwP(s, '那位太太把你的头发托在手里掂了掂，说：二十块。你说：快给我。');
      lwP(s, '回家你拿火钳把剩下的头发烫成一头小卷，像个逃学的男孩。');
    } else lwP(s, '你把头发盘回去了。');
    s.phase = '买';
    lwP(s, '你出门去给吉姆挑礼物。手里有 ' + s.money.toFixed(2) + ' 块。');
  } else if (s.phase === '买') {
    if (a !== '不买') {
      s.gift = a.slice(1);
      s.money -= LW_PRICE[s.gift];
      lwP(s, '你买了' + s.gift + '，包好了，揣着回家。');
    } else lwP(s, '你转了一下午，什么也没买，回家了。');
    s.phase = '完';
    lwEnding(s);
  }
}

function lwEnding(s) {
  var t = lwTarget(s);
  var sold = LW_PRICE[t] > LW_SAVE;
  if (s.selfGlove && !sold && LW_PRICE[t] > LW_SAVE - LW_PRICE['手套']) t = '缎带';
  lwP(s, '');
  lwP(s, '七点，咖啡煮好了，肉排在灶上热着。你听见他上楼。');
  lwP(s, '门开了，吉姆进来，关上门。');
  if (s.selfGlove) lwP(s, '他手上戴着一副新手套，跟手套铺窗里那副一样。');
  if (!s.hair) {
    if (t === '梳子' || t === '缎带') {
      lwP(s, '他站在门口不动，眼睛盯着你。那张脸你读不出来：不是生气，不是吃惊，不是不高兴。你吓坏了。');
      lwP(s, '“你说头发没了？”他问，像是还没想明白。');
      lwP(s, '“剪了，卖了，”你说，“会长回来的。你不会嫌我吧？”');
    } else lwP(s, '他看了你一会儿，说：“短了。”走过来摸了摸你的头。');
  } else lwP(s, '他看见你，笑了一下，脱了大衣。');
  if (t === '梳子') {
    lwP(s, '他从大衣兜里掏出一个小包，扔在桌上。是那套玳瑁梳子。');
    if (s.hair) lwP(s, '你把梳子插进头发里，跑到镜子前去照。');
    else lwP(s, '你把梳子捧在怀里，哭了一会儿，抬起头说：“我头发长得可快了，吉姆！”');
  } else if (t === '缎带') {
    lwP(s, '他从兜里掏出一卷蓝缎带。');
    if (s.hair) lwP(s, '你拿它把头发系起来了。');
    else lwP(s, '你拿在手里，往头上比了比，短头发系不住，你把它绕在手腕上了。');
  } else lwP(s, '他从兜里掏出一个包，是那条兔毛领子。你围上了，正好。');
  if (s.gift === '表链') {
    lwP(s, '你把表链托在手心里递给他：“好看吧？把表给我，我想看看拴上什么样。”');
    if (sold) {
      lwP(s, '吉姆没去掏表。他往沙发上一躺，两手垫在脑后，笑了。');
      lwP(s, '“黛儿，咱们把礼物收起来放一阵吧，现在用太好了。我把表卖了，给你买的。你去煎肉排吧。”');
    } else lwP(s, '吉姆掏出表，解了那根旧皮绳，把链子拴上。他当着你的面，看了一回钟点。');
  } else if (s.gift === '手套' && s.selfGlove) {
    lwP(s, '你把手套递给他。他看看你手里的，又看看自己手上的，笑了：“这下有两副了。”');
    lwP(s, '“我看你老在那个窗前站着，”他说，“怕你拿买菜的钱给我买。”');
  } else if (s.gift === '手套') {
    lwP(s, '你把手套递给他。他戴上，搓了搓，说暖和。');
    if (sold) lwP(s, '他把戴着手套的手揣进兜里，兜里空了一块。');
  } else lwP(s, '你说今年没买着。他说没事。');
  if (sold) lwP(s, '那天晚上他没掏表。');
  lwP(s, '');
  lwP(s, '—— 这一礼拜 ——');
  s.week.forEach(function (row) {
    var stops = row[1], seen = [], parts = [];
    stops.forEach(function (w) { if (seen.indexOf(w) < 0) { seen.push(w); parts.push(w + lwCount(stops, w) + '下'); } });
    var st = stops.length ? '你停在' + parts.join('、') : '你一路没停';
    lwP(s, row[0] + '：' + st + '。' + row[2]);
  });
  lwP(s, '12 月 24 日：你' + (!s.hair ? '卖了头发' : '没卖头发') + '，买了' + (s.gift || '（没买）') + '。他' + (sold ? '卖了表' : '没卖表') + '，买了' + t + (s.selfGlove ? '，还给自己买了一副手套。' : '。'));
  lwP(s, '（完）');
}

function lwRun(acts) {
  var s = lwNew();
  lwStartNight(s);
  for (var i = 0; i < acts.length; i++) {
    if (s.phase === '完') { lwP(s, '（一局已经完了。）'); break; }
    lwP(s, '> ' + acts[i]);
    lwAct(s, acts[i]);
  }
  if (s.phase !== '完') {
    lwP(s, '');
    lwP(s, '能做的：' + lwMenu(s).join(' / '));
  }
  return {out: s.out, done: s.phase === '完', ask: lwMenu(s), s: s};
}

if (typeof module !== 'undefined') module.exports = {lwRun: lwRun};
