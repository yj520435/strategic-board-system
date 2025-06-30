import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

function formatDateTime(args: string) {
  const date = new Date(args);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const CardContentNoPadding = styled(CardContent)(`
  padding: 16px;
  &:last-child {
    padding-bottom: 16px;
  };
`);

const PAGE_SIZE = 9;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/pt',
});

const fetchData = async (strategy: string, page: number) => {
  const response = await axiosInstance.get('/posts', {
    params: {
      strategy: strategy.toUpperCase(),
      page: page - 1,
      size: PAGE_SIZE,
    },
  });
  console.log('Fetch Data: ', response.data);
  return response.data;
};

export default function Board({ strategy }: Readonly<{ strategy: string }>) {
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<Array<Post>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [totalPages, setTotalPages] = useState(1);

  const mountedRef = useRef(false);
  const strategyRef = useRef(strategy);
  const totalPagesRef = useRef(1);
  const [loadedPage, setLoadedPage] = useState(0);

  const loaderRef = useRef(null);
  const handleChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    const rootDiv = document.querySelector('.MuiBox-root');
    if (rootDiv) rootDiv.scrollTo({ top: 0, behavior: 'smooth' });
    // console.log(rootDiv);
    setPage(value);
  };

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  // useEffect(() => {
  //   setPage(1);
  //   setItems([]);
  // }, [strategy]);

  useEffect(() => {
    console.log(
      `Load "${page}" page with "${strategy}" Strategy, Loaded page is "${loadedPage}"`
    );

    if (strategy === 'scroll' && page > totalPagesRef.current) {
      setIsLoading(false);
      return;
    }

    if (page !== loadedPage) {
      fetchData(strategy, page)
        .then((res) => {
          const data = res?.data?.content ?? [];

          if (strategy === 'page') {
            setItems(data);
            totalPagesRef.current = res?.data?.totalPages;
          } else {
            setItems((prev) => [...prev, ...data]);
          }

          setLoadedPage(page);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [page, strategy, loadedPage]);

  useEffect(() => {
    console.log(`Observe with "${strategy}" startegy`);
    strategyRef.current = strategy;

    if (strategy !== 'scroll') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoading(true);
          setTimeout(() => setPage((prev: number) => prev + 1), 1000);
        }
      },
      { threshold: 1 }
    );

    const target = loaderRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loaderRef, strategy]);

  return (
    <Box className={styles.cards}>
      {!mountedRef.current ? (
        <Grid container spacing={1}>
          {new Array(9).fill(true).map((x, i) => (
            <Skeleton variant="rounded" width={327} height={315} key={i} />
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {/* {isLoading
          ? new Array(PAGE_SIZE).map((x, i) => (
              <Skeleton variant="rounded" width={200} height={315} key={i}>
                {x}
              </Skeleton>
            ))
          : null} */}
          {items.map((x: Post) => (
            <Grid size={4} key={x.id}>
              <Card variant="outlined" raised sx={{ height: 360 }}>
                <CardContentNoPadding>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {formatDateTime(x.createdAt)}
                  </Typography>
                  <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                    {x.title}
                  </Typography>
                  <Typography>{x.author}</Typography>
                  <Typography paddingY={3}>{x.content}</Typography>
                </CardContentNoPadding>
                <CardActions sx={{ justifyContent: 'right' }}>
                  <Button size="small">more</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {'scroll' === strategy ? (
        <div ref={loaderRef} className={styles.loader}>
          {isLoading && page <= totalPagesRef.current ? <CircularProgress /> : null}
        </div>
      ) : (
        <Stack
          spacing={2}
          sx={{ alignItems: 'center', paddingTop: 5 }}
          className={styles.pg}
        >
          <Pagination count={totalPagesRef.current} page={page} onChange={handleChange} />
        </Stack>
      )}
    </Box>
  );
}
