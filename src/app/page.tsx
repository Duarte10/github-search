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
  ListItemButton,
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [candidateSearchString, setCandidateSearchString] =
    useState<string>("");
  const [searchString, setSearchString] = useState<string>("");
  const [endCursor, setEndCursor] = useState<string>("");
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

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
    search(searchString, "");
  }, [searchString]);

  const search = (searchString: string, startCursor: string | undefined) => {
    if (!searchString) {
      return;
    }

    if (!startCursor) {
      setRepositories([]);
    }
    setIsLoading(true);
    const query = `query {
        search(query: "${searchString}", type:REPOSITORY, first:15 ${startCursor ? `, after: "${startCursor}"` : ""}) {
          pageInfo {
            startCursor
            hasNextPage
            endCursor
          },
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

        if (startCursor) {
          setRepositories([...repositories, ...mappedResult]);
        } else {
          setRepositories(mappedResult);
        }
        setEndCursor(result.data.search.pageInfo.endCursor);
        setHasNextPage(result.data.search.pageInfo.hasNextPage);
        setIsLoading(false);
      });
  }

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
           '@media (min-width: 600px)' : {
              width: '60%'
            },
            '@media (min-width: 780px)' : {
              width: '50%'
            },
            '@media (min-width: 1200px)' : {
              width: '40%'
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
        {(repositories.length > 0 || isLoading) && (
          <List sx={{ width: "100%" }}>
            {repositories.map((r) => (
              <React.Fragment key={r.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={r.name} src={r.ownerAvatarUrl} />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={r.name} 
                    primaryTypographyProps={{  whiteSpace: "normal", overflow: "hidden" } }
                    secondaryTypographyProps={{  whiteSpace: "normal", overflow: "hidden" } }
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
            {
              hasNextPage && !isLoading && <ListItem key="load-more-option">
                  <ListItemButton role={undefined} onClick={() => search(searchString, endCursor)} dense>
                    <ListItemText 
                      primary="Load more" 
                      primaryTypographyProps={{  textAlign: "center", fontSize: '1rem' } }
                    />
                  </ListItemButton>
              </ListItem> 
            }
            {
              isLoading && <ListItem key="loading">
                  <ListItemText primary="Loading results..." primaryTypographyProps={{  textAlign: "center"} }></ListItemText>
              </ListItem>
            }
          </List>
        )}
      </Box>
    </>
  );
}
