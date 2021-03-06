import React, {
  useState, useEffect, useRef
} from 'react';
import { observer } from 'mobx-react';
import styles from './index.module.less';

const offset = 10; // 上下多余元素个数
const itemHeight = 40; // 计算单个元素高度
const containerHeight = 410; // 容器高度
const visibleCount = Math.ceil(containerHeight / itemHeight); // 可视区域可放置元素个数

export default observer(() => {
  const [allData] = useState(() => {
    const res = [];
    for (let i = 1; i <= 10000; i++) {
      res.push(i);
    }
    return res;
  });
  const [startHeight, setStartHeight] = useState(0);
  const [endHeight, setEndHeight] = useState(0);

  const [data, setData] = useState(allData.slice(0, 20));
  const containerRef = useRef(null);

  useEffect(() => {
    if (allData.length <= visibleCount) return;
    function setHeight() {
      const { scrollTop } = containerRef.current;
      const startIndex = Math.ceil(scrollTop / 40);
      const start = startIndex - offset > 0 ? startIndex - offset : 0;
      const end = startIndex + visibleCount + offset < allData.length
        ? startIndex + visibleCount + offset : allData.length;
      setData(allData.slice(start, end));
      setStartHeight(start * 40);
      setEndHeight((allData.length - end) * 40);
    }

    setHeight();

    let timer = null;

    function debounce(func, delay) {
      if (timer) return;
      timer = setTimeout(() => {
        func();
        timer = null;
      }, Number(delay));
    }

    containerRef.current.addEventListener('wheel', () => {
      debounce(setHeight, 120);
    });
  }, [allData]);

  return (
    <div>
      <div
        className={styles.virtual__container}
        style={{ height: containerHeight }}
        ref={containerRef}
      >
        <div style={{ height: startHeight }}></div>

        {data.map((item) => <div
          className={styles.virtual__text}
          style={{ height: itemHeight }}
          key={item}
        >
          {item}
        </div>)}

        <div style={{ height: endHeight }}></div>
      </div>
    </div>
  );
});
