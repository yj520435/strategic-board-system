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
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import { formatDateTime } from '@/utils';
import { getList } from '@/api';

const PAGE_SIZE = 9;

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const CardContentNoPadding = styled(CardContent)(`
  padding: 16px;
  &:last-child {
    padding-bottom: 16px;
  };
`);

export default function Board({ strategy }: Readonly<{ strategy: string }>) {
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<Array<Post>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loaderRef = useRef(null);
  const mountedRef = useRef(false);

  const strategyRef = useRef(strategy);
  const totalPagesRef = useRef(1);
  const totalElementsRef = useRef(0);
  const loadedPageRef = useRef(1);

  // 스크롤 이동 이벤트
  function scrollTo(to: 'top' | 'bottom') {
    const rootDiv = document.querySelector('.MuiBox-root');
    if (!rootDiv) return;

    if (to === 'top') {
      rootDiv.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const height = rootDiv.scrollHeight - (rootDiv as HTMLElement).offsetHeight - 420;
      rootDiv.scrollTo({ top: height, behavior: 'smooth' });
    }
  }

  // 페이지네이션 이벤트
  const handleChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    scrollTo('top');
    setPage(value);
  };

  // 마운트 시 스켈레톤 컴포넌트 로드
  useEffect(() => {
    mountedRef.current = true;
  }, []);

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    if (strategy === 'scroll') return;

    getList(strategy, page, PAGE_SIZE)
      .then((res) => {
        const data = res?.data?.content ?? [];
        setItems(data);

        if (strategy === 'page') {
          totalPagesRef.current = res?.data?.totalPages;
          totalElementsRef.current = res?.data?.totalElements;
        }

        loadedPageRef.current = page;
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, strategy]);

  // 페이지 → 스크롤 전환 시 이전 데이터 로드
  useEffect(() => {
    if (strategy === 'scroll') {
      if (loadedPageRef.current === 1) return;

      getList(strategy, 1, PAGE_SIZE * (loadedPageRef.current - 1))
        .then((res) => {
          const data = res?.data?.content ?? [];
          setItems((prev) => [...data, ...prev]);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            scrollTo('bottom');
          }, 500);
        });
    }
  }, [strategy]);

  // 옵저버 콜백
  const load = useCallback(async () => {
    if (isLoading) return;

    if (page > totalPagesRef.current) {
      setPage(totalPagesRef.current);
      return;
    }

    setIsLoading(true);
    const res = await getList('scroll', page + 1, PAGE_SIZE);
    const data = res?.data?.content ?? [];
    setItems((prev) => [...prev, ...data]);
    setPage((d) => d + 1);
    loadedPageRef.current = page;
    setIsLoading(false);
  }, [page, isLoading]);

  // 옵저버
  useEffect(() => {
    strategyRef.current = strategy;

    const isLastPage = loadedPageRef.current === totalPagesRef.current;
    if (strategy !== 'scroll' || isLastPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) load();
      },
      { threshold: 1 }
    );

    const target = loaderRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [strategy, load]);

  return (
    <Box className={styles.cards}>
      <Box
        width="100%"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 3,
        }}
      >
        <Typography fontWeight={600} mx={1}>
          {strategy} ({loadedPageRef.current} of {totalPagesRef.current})
        </Typography>
        <Typography fontWeight={600} mx={1}>
          total: {totalElementsRef.current}
        </Typography>
      </Box>
      {!mountedRef.current ? (
        <Grid container spacing={1}>
          {new Array(PAGE_SIZE).fill(true).map((x, i) => (
            <Skeleton variant="rounded" width={322} height={360} key={i} />
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {items.map((x: Post) => (
            <Grid size={4} key={x.id}>
              <Card variant="outlined" raised sx={{ height: 360 }}>
                <CardContentNoPadding>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {formatDateTime(x.createdAt)}
                  </Typography>
                  <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                    {x.title} #{x.id}
                  </Typography>
                  <Typography>{x.author}</Typography>
                  <Typography paddingY={3} height={190} className={styles.ellipsis}>
                    {x.content}
                  </Typography>
                </CardContentNoPadding>
                <CardActions sx={{ justifyContent: 'right' }}>
                  <Button size="small">more</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          <Grid size={12}>
            <div ref={loaderRef} className={styles.loader}>
              {isLoading && page <= totalPagesRef.current ? <CircularProgress /> : null}
            </div>
          </Grid>
        </Grid>
      )}
      {'page' === strategy ? (
        <Stack
          spacing={2}
          sx={{ alignItems: 'center', paddingTop: 5 }}
          className={styles.pg}
        >
          <Pagination count={totalPagesRef.current} page={page} onChange={handleChange} />
        </Stack>
      ) : null}
    </Box>
  );
}
