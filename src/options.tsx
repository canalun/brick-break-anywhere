import addedIcon from "data-base64:../assets/added_icon.png"
import extListIcon from "data-base64:../assets/ext_list_icon.png"
import pin from "data-base64:../assets/pin.png"
import startButton from "data-base64:../assets/start_button.png"

function NewTab() {
  return (
    <>
      <h1>Brick Break Anywhere</h1>
      <div style={{ fontSize: "18px" }}>
        <p>(日本語版が下にあります)</p>
        <p>Thank you for installing me🎉</p>
        <p>
          Please <strong>follow just three steps as below</strong> to enjoy
          breaking bricks on a web page!
        </p>
        <p>
          <strong>
            1. Open the extension list by clicking the below "jigsaw puzzle"
            icon at the top right of this window.
          </strong>
        </p>
        <img style={{ width: "200px" }} src={extListIcon}></img>
        <p>
          <strong>
            2. Find the item of this extension from the list, and clicking the
            icon of "pin".
          </strong>
        </p>
        <img style={{ width: "340px", marginBottom: "20px" }} src={pin}></img>
        <br></br>
        <p>
          <strong>
            Now, you can find the icon of this extension fixed at the top right
            of this window.
          </strong>
        </p>
        <img style={{ width: "300px" }} src={addedIcon}></img>
        <p>
          <strong>3. Now you can break bricks anywhere.</strong>
        </p>
        <p>
          <strong>
            On any web page (except for this page), click the added icon and
            start the game from the "start" button!!
          </strong>
        </p>
        <img style={{ width: "300px" }} src={startButton}></img>
        <p>FAQ</p>
        <p>
          Q: Is this game safe to play thought it looks like breaking the web
          page...
        </p>
        <p>
          A: It's safe! It just uses a little magic to make the web page looking
          like broken.
        </p>
        <p>
          In short, it's a kind of elaborate jokes. So don't worry and enjoy!
        </p>
      </div>
      <hr />
      <h1>Webページ崩し</h1>
      <div style={{ fontSize: "18px" }}>
        <p>インストールしてくださりありがとうございます🎉</p>
        <p>下記3つの手順で、好きなウェブページをくずしてください！</p>
        <p>
          <strong>
            1.
            このウィンドウの右上にあるジグソーパズルのアイコンを押して、拡張のリストを表示して下さい
          </strong>
        </p>
        <img style={{ width: "200px" }} src={extListIcon}></img>
        <p>
          <strong>
            2.
            リストの中にあるこの拡張の欄の、ピンのアイコンをクリックして下さい
          </strong>
        </p>
        <img style={{ width: "340px", marginBottom: "20px" }} src={pin}></img>
        <br></br>
        <p>
          <strong>この拡張のアイコンが右上に追加されたはずです</strong>
        </p>
        <img style={{ width: "300px" }} src={addedIcon}></img>
        <p>
          <strong>3. これでどこでもブロックをくずせるようになりました！</strong>
        </p>
        <p>
          <strong>
            好きなウェブページ(ただしこのページ以外)で、先ほど追加されたアイコンをクリックし、スタートボタンからゲームを始めてください！
          </strong>
        </p>
        <img style={{ width: "300px" }} src={startButton}></img>
        <p>よくある質問</p>
        <p>
          Q:
          ウェブページを本当に壊してしまっていますか？遊んでも大丈夫なのでしょうか？
        </p>
        <p>
          A:
          大丈夫です！本当には壊していません。壊しているように見せているだけです😊
        </p>
        <p>要するに、手品のようなものです。安心して気軽にお楽しみください！</p>
      </div>
    </>
  )
}

export default NewTab
