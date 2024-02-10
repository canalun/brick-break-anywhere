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
            On any web page, click the added icon and start the game from the
            "start" button!!
          </strong>
        </p>
        <img style={{ width: "300px" }} src={startButton}></img>
      </div>
      <hr />
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
            好きなページに移動して、先ほど追加されたアイコンをクリックし、スタートボタンからゲームを始めてください！
          </strong>
        </p>
        <img style={{ width: "300px" }} src={startButton}></img>
      </div>
    </>
  )
}

export default NewTab
