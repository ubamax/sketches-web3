import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useMinterContract } from "../../hooks/useMinterContract";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useNavigate } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import { ReactSketchCanvas } from "react-sketch-canvas";
import "./Mint.css";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

const Mint = () => {
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [image, setImage] = useState(null);
  const [brushColor, setBrushColor] = useState("black");

  const nftContract = useMinterContract();
  const { address, connect, performActions } = useContractKit();
  // const { defaultAccount } = kit;
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) {
      (async () => {
        await connect();
      })();
    }
  }, [address, connect]);

  const isFormFiled = () => {
    if (image === null || name === null || description === null) {
      return false;
    } else {
      return true;
    }
  };

  // Save image to file storage
  const download = () => {
    const node = document.querySelector(".canv");
    htmlToImage
      .toPng(node)
      .then((dataUrl) => {
        const elem = document.createElement("a");
        elem.setAttribute("href", dataUrl);
        elem.setAttribute("download", "nft_canvas");
        document.body.appendChild(elem);
        elem.click();
        elem.remove();
      })
      .catch(function (error) {
        console.error("An error as occured");
        console.log({ error });
      });
  };

  const handleSubmit = async (e) => {
    await mintNft();
    alert("Token minted successfully!");
    navigate("/");
  };

  const client = new Web3Storage({ token: process.env.REACT_APP_API_TOKEN });

  const formattedName = (name) => {
    let file_name;
    const trim_name = name.trim();
    if (trim_name.includes(" ")) {
      file_name = trim_name.replaceAll(" ", "%20");
      return file_name;
    } else return trim_name;
  };

  const makeFileObjects = (file) => {
    const blob = new Blob([JSON.stringify(file)], { type: "application/json" });
    const files = [new File([blob], `${file.name}.json`)];
    return files;
  };

  const uploadToIPFS = async (file) => {
    if (!file) return;
    try {
      const file_name = file[0].name;
      const image_name = formattedName(file_name);
      const image_cid = await client.put(file);
      const image_url = `https://${image_cid}.ipfs.w3s.link/${image_name}`;
      return image_url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  // mint an NFT
  const mintNft = async () => {
    await performActions(async (kit) => {
      if (!name || !description || !image) return;
      const { defaultAccount } = kit;

      // trim any extra whitespaces from the name and
      // replace the whitespace between the name with %20
      const file_name = formattedName(name);
      // convert NFT metadata to JSON format
      const data = {
        name,
        image,
        description,
        owner: defaultAccount,
      };

      try {
        // save NFT metadata to IPFS
        const files = makeFileObjects(data);
        const file_cid = await client.put(files);
        const URI = `https://${file_cid}.ipfs.w3s.link/${file_name}.json`;
        console.log("Token URI => " + URI);

        // upload the NFT, mint the NFT and save the IPFS url to the blockchain
        let transaction = await nftContract.methods
          .mint(URI)
          .send({ from: defaultAccount });
        return transaction;
      } catch (error) {
        console.log("Error minting token: ", error);
      }
    });
  };

  return (
    <div className="create">
      <div className="create_form">Create New NFT</div>
      <div className="form-new">
        <div className="form-form">
          <Form onSubmit={(e) => handleSubmit(e)}>
            <div className="canv" style={{ height: "400px" }}>
              <ReactSketchCanvas strokeWidth={4} strokeColor={brushColor} />
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <div>
                <input
                  type="color"
                  onChange={(e) => setBrushColor(e.target.value)}
                  style={{}}
                />
                <span style={{margin: "10px"}}>Select color</span>
              </div>
              <Button variant="dark" type="button" onClick={() => download()}>
                Save
              </Button>
            </div>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Sketch Incription</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="What did you sketch out?"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea3"
            >
              <Form.Label>Sketch Meaning</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="What does it mean?"
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Upload image you just saved</Form.Label>
              <Form.Control
                type="file"
                onChange={async (e) => {
                  console.log(e.target.files);
                  const image_file = e.target.files;
                  console.log(image_file);
                  const imageUrl = await uploadToIPFS(image_file);
                  if (!imageUrl) {
                    alert("Failed to upload image");
                    return;
                  }
                  console.log(imageUrl);
                  setImage(imageUrl);
                }}
              />
            </Form.Group>
            <div className="mint-btns">
              <Button
                variant="dark"
                type="button"
                onClick={() => navigate("/")}
              >
                Close
              </Button>

              <Button
                style={{ marginLeft: "auto" }}
                disabled={!isFormFiled()}
                variant="dark"
                type="submit"
              >
                Create
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Mint;
