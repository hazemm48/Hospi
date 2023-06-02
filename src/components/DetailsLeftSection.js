import { removeFile, uploadFile } from "../adminAPI.js";
import manImg from "../images/man.svg";
import moment from "moment";

const DetailsLeftSection = ({ data, type, GetDetails, setLoading }) => {
  console.log(data, type);

  let addProfilePic = async (e) => {
    let formData = new FormData();
    formData.append("fieldName", "users");
    formData.append("id", data._id);
    formData.append("image", e.target.files[0]);

    let add = await uploadFile(formData, "uploadProfilePic");
    if (add.message == "done") {
      setLoading(true);
      GetDetails();
    }
    console.log(add);
  };

  const removeProfilePic = async () => {
    let body = {
      id: data._id,
      path: data.image,
    };
    let deleted = await removeFile(body, "removeProfilePic");
    if (deleted.message == "image deleted") {
      setLoading(true);
      GetDetails();
    }
  };
  return (
    <div className="col-md-4">
      <div className="mini-card text-center">
        <div className="card-header">
          <img
            className="rounded-circle"
            src={data.image ? data.image : manImg}
            loading="lazy"
          />
        </div>
        <div className="card-body">
          <div className="">
            <button
              className="btn btn-red-f-gr btn-sm float-center"
              style={{ margin: "1em" }}
              onClick={() => {
                removeProfilePic();
              }}
            >
              <i className="las la-trash" />
              delete
            </button>
            <input
              type="file"
              accept="image/*"
              id="imgupload"
              style={{ display: "none" }}
              onChange={(e) => {
                addProfilePic(e);
              }}
            />
            <button
              className="btn btn-dark-red-f btn-sm float-center"
              style={{ margin: "1em" }}
              onClick={() => {
                document.getElementById("imgupload").click();
              }}
            >
              <i className="las la-image" />
              change
            </button>
          </div>
          <input
            name="name"
            id="name"
            className="form-control"
            defaultValue={data.name}
            disabled
            style={{ textAlign: "center" }}
          />

          <small className="text-muted">{data._id}</small>
          <h5>Age</h5>
          <p>{moment().diff(data[`${type}Info`]?.birthDate, "years")}</p>
        </div>
      </div>
    </div>
  );
};
export default DetailsLeftSection;
