# ListeningTest

・リスニングクイズを作成／実行するためのウェブアプリ一式です。

　以下のようなクイズを作成し、使用できるようになります。

https://mmurak.github.io/ListeningTest/LTengine.html?SC=YES&Q=Sample


I. 作問プログラム編

　《起動方法》

　　ブラウザーからLTmaker.htmlにアクセスします。

　　なお、このプログラムは必要なファイルをダウンロードしておけば、ローカル環境でも利用可能です。

　　必要なファイルは以下の通りです。

* LTmaker.html： プログラム本体
* kiwi-bird.png： ブラウザーのタブに表示されるアイコン画像
* scripts/wavesurfer.js： 音声関連の処理をするライブラリー（ローカル環境にプログラム一式をダウンロードする場合は、LTmaker.htmlを配置したディレクトリの直下にscriptsというディレクトリを作成し、その中にwavesurfer.jsを格納してください）。

　　あとは（当たり前ですが ^^;）音源となるファイルが必要です。

　《使い方》

1. LTmaker.htmlの画面左上にあるファイル選択ボタンから音源ファイルを選択すると、音源全体の波形が表示されます。
2. 波形上から出題開始点をクリックします。
3. ［Play（Pause）］ボタンを押すと、その場所から再生が開始されるので、出題範囲の終了時点でもう一度［Play（Pause）］ボタンを押します（これで再生は停止します）。
4. 再生と停止を行うことで、再生開始時間と再生終了時間の情報が画面下部のログ領域に追加されていくため、以下のいずれかの操作を行います。

　　　　(a). 指定した範囲の内容を音声で確認するにはログ領域右端の［p.play］ボタンを押します。

　　　　(b). 範囲取得がイマイチだった場合は、［dismiss］ボタンを押して削除します。

　　　　(c). それでOKの場合には[dismiss]ボタンの右横のフィールドにテキスト（スクリプト）を入力します。

　　　　　　このテキストの特定範囲を連続した2つの半角括弧で囲むと、そこが穴空きの出題部分になります。

5. すべての作業が完了したのであれば、「ログファイル出力」リンクをクリックすると、ファイル保存ダイアログが表示されるので、ファイルを保存します（拡張子は「.json」にする必要があります。また、ファイル名は音源ファイルと同じ名前にしておくと管理が楽です）。

　　　　なお、音源ファイルと、この .json ファイルの2ファイルがテスト一式となります。


II. テスト実行プログラム編

　《テスト実行プログラムに必要となる環境》

1. テスト実行プログラムはhttp（またはhttps）プロトコルによるネットワークアクセスが必要です。このためどこかのサーバー上に環境を用意します。
2. http（またはhttps）でアクセスできる場所に以下のファイルを配置します。
* LTengine.html　：　テストがアクセスするページ本体です。
* kiwi-bird.png　：　ブラウザーのタブに表示されるアイコンです。
* praise.css　：　全問正解時に表示される「ご褒美機能」の定義ファイルです。
* scripts/listeningtest.js　：　テストプログラム本体です。
* scripts/wavesurfer.js　：　音声の再生に使用するライブラリーです。
* scripts/praise.js　：　全問正解時に表示される「ご褒美機能」のプログラムです。
3. 作問プログラムで作成した.jsonファイルと音源ファイルを resources ディレクトリに格納します。

　《使用方法》

　　ブラウザーからLTengine.htmlにアクセスします。

　　なお、実行時には必ず「Q」パラメータから作成した「.json」ファイル名を指定する必要があります（拡張子は指定しません）。

　　　例（ABC.jsonファイルが resources ディレクトリにある場合）

　　　　http://〜/LTengine.html?Q=ABC　　← がアクセスするURLになります。

　《おまけ》

　　Qパラメーター以外に、SC=YES という指定（Speed Control）が用意されています。

　　SC＝YESを付加すると、再生速度を変更するプルダウンリストが表示されます（すべて大文字で記述する必要がありま）。

　　　例　：　http://〜/LTengine.html?Q=ABC&SC=YES

　　さらに、GU=YES という指定（Give Up）を追加した場合、解答欄に半角の「?」を10回入力すると該当の単語の答えが赤字で表示されます（すべて大文字で記述する必要があります）。

　　　例　：　LTengine.html?Q=Sample&GU=YES

