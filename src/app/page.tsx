"use client";

import {
  Box,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import { useEffect, useState } from "react";

interface Repository {
  name: string;
  shortDescriptionHTML: string;
  ownerAvatarUrl: string;
}

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [candidateSearchString, setCandidateSearchString] =
    useState<string>("");
  const [searchString, setSearchString] = useState<string>("");

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
        console.log(result);
        const mappedResult = result.data.search.edges.map(
          (item: any) =>  {
            return {
              name: item.node.nameWithOwner,
              shortDescriptionHTML: item.node.shortDescriptionHTML,
              ownerAvatarUrl: item.node.owner.avatarUrl
            }
          }
        );
        console.log(mappedResult);
        setRepositories(mappedResult);
      });
  }, [searchString]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
        pt: 12,
      }}
    >
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
          <List sx={{ overflow: "auto" }}>
            {repositories.map((r, index) => (
              <ListItem disablePadding key={index}>
                <ListItemButton>
                  <ListItemText primary={r.name} />
                  <ListItemIcon>
                    <Icon>star</Icon>
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
