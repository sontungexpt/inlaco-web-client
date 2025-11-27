import { Button, IconButton, Box } from "@mui/material";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { COLOR } from "../../assets/Color";
import { useField, useFormikContext } from "formik";

const FileUploadField = ({
  name,
  label = "File hợp đồng",
  disabled,
  sx = [],
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleFileChange = (event) => {
    setFieldValue(name, event.target.files[0]);
  };

  const handleDelete = () => {
    setFieldValue(name, null);
  };

  return (
    <Box
      {...props}
      sx={[
        {
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          width: "50%",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <p
        style={{
          marginRight: 4,
          fontSize: 16,
          color: COLOR.PrimaryBlackPlaceHolder,
        }}
      >
        {label}:{" "}
      </p>
      {!field.value ? (
        <label>
          <input
            id="file-upload"
            disabled={disabled}
            type="file"
            accept=".doc,.docx,.pdf,.xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            disabled={disabled}
            onClick={() => document.getElementById("file-upload").click()}
            variant="contained"
          >
            Tải lên tệp
          </Button>
        </label>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <a
            href={URL.createObjectURL(field.value)}
            download={field.value.name}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "300px", // Adjust the max-width as needed
              display: "inline-block",
              marginLeft: 2,
            }}
          >
            {field.value.name}
          </a>
          <IconButton
            onClick={handleDelete}
            sx={{ color: COLOR.PrimaryOrgange }}
          >
            {!disabled && (
              <DeleteForeverRoundedIcon sx={{ width: 24, height: 24 }} />
            )}
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadField;
