import { removeFile, uploadFile } from "../adminAPI.js";
import maleImg from "../images/male.jpg";
import femaleImg from "../images/female.jpg";
import moment from "moment";

const DetailsLeftSection = ({ data, type, GetDetails, setLoading, role,superAdmin }) => {
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
            style={{width:'10em',height:'10em'}}
            src={
              data.image
                ? data.image
                : data.gender == "male"
                ? maleImg
                : femaleImg
            }
            loading="lazy"
          />
        </div>
        <div className="card-body">
          {superAdmin && (
            <div style={{display:'inline-flex'}}>
              <button
                className="btn btn-red-f-gr btn-sm float-center"
                style={{ margin: "1em" }}
                onClick={() => {
                  removeProfilePic();
                }}
              >
                <i className="las la-image" />
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
          )}

          <input
            name="name"
            id="name"
            className="form-control"
            defaultValue={data.name}
            disabled
            style={{ textAlign: "center" }}
          />

          <small className="text-muted">{data._id}</small>
          {data.role != "admin" && (
            <>
              <h5>Age</h5>
              <p>{moment().diff(data[`${type}Info`]?.birthDate, "years")}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default DetailsLeftSection;
