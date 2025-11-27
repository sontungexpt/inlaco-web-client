import { Card, CardMedia, IconButton } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { styled } from "@mui/system";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

const Input = styled("input")({
  display: "none",
});

const Overlay = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  opacity: 0,
  transition: "opacity 0.3s",
  "&:hover": {
    opacity: 1,
  },
});

const CardPhotoInput = ({
  name,
  onClick,
  width = 124,
  height = 166,
  sx = [],
  ...props
}) => {
  //3x4 aspect ratio
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue(name, reader.result); // Set the image URL as the field value
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card
      sx={[
        {
          width: width,
          height: height,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Input
        accept="image/*"
        type="file"
        onChange={handleImageChange}
        {...props}
      />
      <CardMedia
        component="img"
        image={
          field.value
            ? field.value
            : require("../../assets/images/placeholder-3x4.gif")
        }
        alt="Selected Card Photo"
        sx={{
          width: width,
          height: height,
        }}
      />
      <Overlay>
        <IconButton onClick={onClick}>
          <AddCircleRoundedIcon width={48} height={48} />
        </IconButton>
      </Overlay>
    </Card>
  );
};

export default CardPhotoInput;
