import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import { useDropzone } from "react-dropzone";
import "../../assets/scss/plugins/extensions/dropzone.scss";

function BasicDropzone(props) {
  const [files, setFiles] = useState([]);
  function dynamicFileType() {
    if (props.dropFileType === "glbFile") return ".glb";
    if (props.dropFileType === "poster") return "image/*";
    if (props.dropFileType === "usdzFile") return ".usdz";
  }
  console.log(dynamicFileType(), props);
  const { getRootProps, getInputProps } = useDropzone({
    accept: dynamicFileType(),
    onDrop: (acceptedFiles) => {
      props.updateStateFile(props.dropFileType, acceptedFiles[0]);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div className="dz-thumb" key={file.name}>
      {props.dropFileType === "poster" ? (
        <div className="dz-thumb" key={file.name}>
          <div className="dz-thumb-inner">
            <img src={file.preview} className="dz-img" alt={file.name} />
          </div>
        </div>
      ) : (
        <div className="dz-thumb-inner">
          <p>{file.name}</p>
          <p>{file.size} bytes</p>
        </div>
      )}
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p className="mx-1">
          Drag 'n' drop some files here, or click to select files
        </p>
      </div>
      <aside className="thumb-container">{thumbs}</aside>
    </section>
  );
}

class ProductDropFile extends React.Component {
  render() {
    return (
      <Card>
        <CardBody>
          <BasicDropzone
            updateStateFile={this.props.updateStateFile}
            dropFileType={this.props.dropFileType}
          />
        </CardBody>
      </Card>
    );
  }
}

export default ProductDropFile;
