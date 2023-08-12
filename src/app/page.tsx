"use client";

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { favoriteAdded, favoriteRemoved } from "../storage/favorites";
import { IRepository } from "@/interfaces/IRepository";
import React from "react";

export default function Search() {
  // local state
  const [repositories, setRepositories] = useState<IRepository[]>([]);
  const [candidateSearchString, setCandidateSearchString] =
    useState<string>("");
  const [searchString, setSearchString] = useState<string>("");

  // redux store
  const favorites = useSelector((state: any) => state.favorites);
  const dispatch = useDispatch();

  useEffect(() => {
    if (candidateSearchString) {
      const delayDebounceFn = setTimeout(() => {
        setSearchString(candidateSearchString);
      }, 200);
      return () => {
        clearTimeout(delayDebounceFn);
      };
    }
  }, [candidateSearchString]);

  useEffect(() => {
    if (!searchString) {
      return;
    }
    const query = `query {
        search(query: "${searchString}", type:REPOSITORY, first:15) {
          edges { 
            node { 
              ... on Repository {
                id,
                nameWithOwner,
                shortDescriptionHTML,
                owner {
                    avatarUrl 
                  }
                } 
              }
            } 
          } 
        }`;

    fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer %GITHUB_PAT%",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((r) => r.json())
      .then((result) => {
        const mappedResult = result.data.search.edges.map((item: any) => {
          return {
            id: item.node.id,
            name: item.node.nameWithOwner,
            shortDescriptionHTML: item.node.shortDescriptionHTML,
            ownerAvatarUrl: item.node.owner.avatarUrl,
          };
        });
        setRepositories(mappedResult);
      });
  }, [searchString]);

  const addFavorite = (repository: IRepository) => {
    dispatch(favoriteAdded({
      id: repository.id,
      repository
    }));
  };

  const removeFavorite = (id: string) => {
    dispatch(favoriteRemoved(id));
  };

  return (
    <>
      <h3>Search Github Repositories</h3>
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
          // width: "calc(100% - 150px)"
          width: "calc(100% - 50px)",
            '@media (min-width: 780px)' : {
              width: '50%'
            }
        }}
      >
        <TextField
          size="small"
          placeholder="Search..."
          value={candidateSearchString}
          onChange={(e) => setCandidateSearchString(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Icon>search</Icon>
              </InputAdornment>
            ),
          }}
        />
        {repositories.length > 0 && (
          <List sx={{ overflow: "auto", width: "100%" }}>
            {repositories.map((r) => (
              <React.Fragment key={r.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={r.name} src={r.ownerAvatarUrl} />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={r.name} 
                    primaryTypographyProps={{  overflow: "hidden" } }
                    secondary={r.shortDescriptionHTML} />
                  {favorites.hasOwnProperty(r.id) ? (
                    <IconButton onClick={() => removeFavorite(r.id)}>
                      <Icon>star</Icon>
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => addFavorite(r)}>
                      <Icon>star_border</Icon>
                    </IconButton>
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </>
  );
}
