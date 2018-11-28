class Point {
    constructor(x, y) {
        this.x = x;       //x座標
        this.y = y;　　　　//y座標
    }

    distance(p)//長さを求める
    {
        return (Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2)));//三平方の定理で距離を求める
    }//呼び出すときはp1.distance(p2)のように書く

}//円をクラス化

class Graphics {
    constructor(number) {
        this.max = number;
        this.route = [];
        this.solve_canvas = document.querySelector('#solve_canvas');
        this.ctx = this.solve_canvas.getContext('2d');
        this.pa = [];
        this.number = 0; //円の数
        this.solve_canvas.addEventListener('click', (ev) => {
            if (this.max > this.number) {　//指定した円の数より現在の円の数が下回る場合
                let p = new Point(ev.offsetX, ev.offsetY);
                this.pa.push(p); //クリックして作った円を配列に入れ
                this.number++;//円が書かれた個数
                this.draw(ev.offsetX, ev.offsetY, 10);//サイズ10でクリックした位置に円を描く
            }
        });//クリックされた場所を取得してdrawを呼び出す

        document.getElementById("clear").addEventListener("click", () => {
            this.ctx.clearRect(0, 0, 950, 420);
            this.pa = [];
            this.number = 0;
        });　　　　　　　　//リセットボタンを押した時に描画領域、配列、個数をリセット

        document.getElementById("start").addEventListener('click', () => {//スタートボタンを押したとき最近傍法が描画される
            let copied = [];
            this.route = [];//経路を保存
            let xorigin = 0;//始点のx座標
            let yorigin = 0;//始点のy座標
            for (let pp of this.pa) copied.push(pp);　//ppにpaを複製しcopiedにppの値をpushする
            var pi = copied.shift();　//先頭を削除して詰めたものをpiに保存 ここでpiの値が変わる
            if (xorigin == 0 && yorigin == 0) {
                xorigin = pi.x;
                yorigin = pi.y;
            }
            var xfst = pi.x;
            var yfst = pi.y;//ここの代入の仕方
            while (copied.length > 0) {
                console.log(pi);
                let near = this.shortest(pi);　//nearにpiからの最短を保存
                let next = copied.indexOf(near); //nextにnearを複製
                pi = copied.splice(next, 1)[0]
                this.route.push(pi);//routeにcopiedから削除した最短経路を入れる
                var xshortest = pi.x; //終点のx座標
                var yshortest = pi.y; //終点のy座標
                this.line(xfst, yfst, xshortest, yshortest);//始点から最短に線を引く
                xfst = xshortest;
                yfst = yshortest;
            }
            this.line(xshortest, yshortest, xorigin, yorigin);


            console.log(this.route);
        });

        document.getElementById("start2").addEventListener('click', () => {
            let pn = [];
            for (let pn of this.route)//最近傍の経路をコピー//代入の仕方
                for (let i = 0; i < this.max - 1; i++) {
                    for (let j = 0; j < this.max - 1; j++) {//i,jそれぞれがthis.max-1の時について
                        if (Math.abs(i - j) > 1) {//隣接していないならば//iかjがthis.max-1の時の処理
                            extra1 = pn[i].distance(pn[j + 1]);//終点を入れ替える
                            extra2 = pn[j].distance(pn[i + 1]);//終点を入れ替える
                            if (pn[i].distance(pn[i + 1]) + pn[j].distance(pn[j + 1]) > extra1 + extra2) {// 元の長さと比べる
                                xx = pn[i].x;
                                yy = pn[i].y;
                                xxx = pn[j].x;
                                yyy = pn[j].y;
                                xxxx = pn[i + 1].x;
                                yyyy = pn[i + 1].y;
                                xxxxx = pn[j + 1].x;
                                yyyyy = pn[j + 1].y;
                                this.cline(xx, yy, xxxx, yyyy);
                                this.cline(xxx, yyy, xxxxx, yyyyy);//元あった線の色を変える
                                this.tline(xx, yy, xxxxx, yyyyy);
                                this.tline(xxx, yyy, xxxx, yyyy);//改善した経路を表示
                            }
                        }
                    }
                }
        });
        //都市の数this.maxをここで変更できるか
        //this.max　=　document.getElementById("citysum");
    }

    draw(cx, cy, r) {//描くメソッド
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
        this.ctx.strokeStyle = 'rgb(0,0,0)';
        this.ctx.fill();
        this.ctx.stroke();
    }

    line(ax, ay, bx, by) {//線を引く
        this.ctx.beginPath();
        this.ctx.moveTo(ax, ay);
        this.ctx.lineTo(bx, by);
        this.ctx.stroke();

    }

    cline(ax, ay, bx, by) {//変更前の線の色を変える
        this.ctx.beginPath();
        this.ctx.moveTo(ax, ay);
        this.ctx.lineTo(bx, by);
        this.ctx.strokeStyle = 'rgb(188,200,219)';
        this.ctx.stroke();

    }

    tline(ax, ay, bx, by) {//変更前の線の色を変える
        this.ctx.beginPath();
        this.ctx.moveTo(ax, ay);
        this.ctx.lineTo(bx, by);
        this.ctx.strokeStyle = 'rgb(229,0,118)';
        this.ctx.stroke();

    }

    shortest(p) {//pからの最小を求める
        var short;
        var d_min = 999999999;//現状の最小
        for (let pi of this.pa) {//piに配列paを複製
            if (pi != p) {
                let d1 = p.distance(pi);//d1にp-pi間の距離を代入
                if (d1 < d_min) {//新しいものが最小ならば
                    d_min = d1;//現状の最小を更新する
                    short = pi;//最小の終点を更新
                    console.log(pi);
                }
            }
        }

        return short;//最短のものを返す
    }
}

window.addEventListener('load', () => {
    var graphics = new Graphics(4);　//this.maxに変えるか
});//最大値を指定
















