class Point {
    constructor(x, y) {
        this.x = x;       //x座標
        this.y = y;　　　　//y座標
        this.next = null;   // 次の点
        this.temp = null;   // 暫定的な次の点
    }

    /**
     * この点からパラメータで与えられた点までの距離を計算する
     * 呼び出すときはp1.distance(p2)のように書く
     * @param p {Point} - 距離を計算したい点
     * @returns {number} - 距離
     */
    distance( p )//長さを求める
    {
        return (Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2)));//三平方の定理で距離を求める
    }

    /**
     * この点から次の点までの距離を計算する
     * @returns {number} - 距離
     */
    distance_chain()
    {
        let start = this;
        var pi = start;
        let distance = 0;
        do {
            distance += Math.sqrt(Math.pow(this.x - this.next.x, 2) + Math.pow(this.y - this.next.y, 2))
            pi = pi.next;
        } while(pi != start);

        return distance;
    }

    /**
     * この点から，暫定的な次の点までの距離を計算する
     * @returns {number} - 距離
     */
    distance_temp()
    {
        let start = this;
        var pi = start;
        let distance = 0;
        do {
            if (this.temp != null) {
                distance += Math.sqrt(Math.pow(this.x - this.temp.x, 2) + Math.pow(this.y - this.temp.y, 2))
                pi = pi.temp;
            } else {
                distance += Math.sqrt(Math.pow(this.x - this.next.x, 2) + Math.pow(this.y - this.next.y, 2))
                pi = pi.next;
            }
        } while(pi != start);

        return distance;
    }

    chain( p ) {
        this.next = p;
    }

    change( p ) {
        this.temp = p.next;
        p.temp = this.next;
    }

}




class Graphics {
    constructor(number) {
        this.max = number;
        this.route = [];
        this.solve_canvas = document.querySelector('#solve_Canvas');
        console.log( this.solve_canvas );
        this.ctx = this.solve_canvas.getContext('2d');
        this.pa = [];
        this.number = 0; //円の数
        this.solve_canvas.addEventListener('click', (ev) => {
            if (this.max > this.number) {　//指定した円の数より現在の円の数が下回る場合
                let p = new Point(ev.offsetX, ev.offsetY);
                console.log(p);
                this.pa.push(p); //クリックして作った円を配列に入れ
                this.number++;//円が書かれた個数
                this.draw_point(ev.offsetX, ev.offsetY, 10);//サイズ10でクリックした位置に円を描く
            }
        });//クリックされた場所を取得してdrawを呼び出す

        document.querySelector("#clear").addEventListener("click", () => {
            this.ctx.clearRect(0, 0, 950, 420);
            this.pa = [];
            this.number = 0;
        });　　　　　　　　//リセットボタンを押した時に描画領域、配列、個数をリセット

        // 最近傍法によるルート設定
        document.querySelector("#start").addEventListener('click', () => {
            this.start = this.pa.shift();
            var pi = this.start;
            var count=0;
            while (this.pa.length > 0) {
                console.log(count++);
                console.log(this.pa.length);
                //console.log(pi);
                let near = this.shortest(pi);　//nearにpiからの最短を保存
                let next = this.pa.indexOf(near); //nextにnearを複製
                let p2 = this.pa.splice(next, 1)[0];
                pi.chain( p2 );
                console.log(pi);
                //this.line(xfst, yfst, xshortest, yshortest);//始点から最短に線を引く
                pi = p2;
            }
            pi.chain( this.start );
            this.draw_next();
        });

        document.querySelector("#start2").addEventListener('click', () => {
            var distance1 = this.start.distance_chain();
            var distance2 = this.start.distance_temp();
            console.log( distance1 );
            console.log( distance2 );
            // var pi = this.start;
            // do {
            //     console.log( "x=" + pi.x + ", y=" + pi.y );
            //     pi = pi.next;
            // } while(pi != this.start);

            //this.draw_next();

            // for( let i=0; i<this.max; i++ ) {
            //     console.log( "---" );
            //     console.log( pi );
            //     console.log( pi.next );
            //     if( pi.next != this.start ) console.log("続く");
            //     else console.log("終わり");
            //     pi = pi.next;
            // }
        });

    }

    draw_point(cx, cy, r) {//描くメソッド
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
        this.ctx.strokeStyle = 'rgb(0,0,0)';
        this.ctx.fill();
        this.ctx.stroke();
    }

    draw_next() {//描くメソッド
        this.ctx.beginPath();
        var pi = this.start;
        this.ctx.moveTo( pi.x, pi.y );
        do {
            this.ctx.lineTo( pi.x, pi. y );
            pi = pi.next;
        }while( pi != this.start )
        this.ctx.lineTo( this.start.x, this.start.y );
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

    * challenge() {

    }
    shortest(p) {//pからの最小を求める
        var short;
        var d_min = 999999999;//現状の最小
        for (let pi of this.pa) {//piに配列paを複製
            // if (pi != p) {
                let d1 = p.distance(pi);//d1にp-pi間の距離を代入
                if (d1 < d_min) {//新しいものが最小ならば
                    d_min = d1;//現状の最小を更新する
                    short = pi;//最小の終点を更新
                    console.log(pi);
                }
            // }
        }

        return short;//最短のものを返す
    }
}

window.addEventListener('load', () => {
    var graphics = new Graphics(4);　//this.maxに変えるか
});//最大値を指定
















