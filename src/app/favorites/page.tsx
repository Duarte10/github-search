"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Rating,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import {
  favoriteRemoved,
  favoriteRatingUpdated,
} from "../../storage/favorites";

export default function Favorites() {
  // redux store
  const favorites = useSelector((state: any) => state.favorites);

  const dispatch = useDispatch();

  const updateFavoriteRating = (id: string, rating: number | null) => {
    dispatch(
      favoriteRatingUpdated({
        id,
        rating,
      })
    );
  };

  const removeFavorite = (id: string) => {
    dispatch(favoriteRemoved(id));
  };

  return (
    <>
      <h3>Favorites</h3>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          bgcolor: "grey.900",
          mt: 1,
          p: 1,
          borderRadius: "4px",
          maxHeight: "100%",
          width: "calc(100% - 50px)",
        }}
      >
        {Object.keys(favorites).length > 0 ? (
          <List sx={{ overflow: "auto", width: "100%" }}>
            {Object.keys(favorites).map((key) => (
              <>
                <ListItem key={key}>
                  <IconButton onClick={() => removeFavorite(key)}>
                    <Icon>delete_outline</Icon>
                  </IconButton>
                  <ListItemAvatar>
                    <Avatar
                      alt={favorites[key].name}
                      src={favorites[key].ownerAvatarUrl}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={favorites[key].name}
                    primaryTypographyProps={{ overflow: "hidden" }}
                    secondary={favorites[key].shortDescriptionHTML}
                  />

                  <Rating
                    name="simple-controlled"
                    value={favorites[key].rating}
                    onChange={(e, newValue) => {
                      updateFavoriteRating(key, newValue);
                    }}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            ))}
          </List>
        ) : (
          <div>
            No favorites found, star repositories to add them to your favorites
            list
          </div>
        )}
      </Box>
    </>
  );
}
