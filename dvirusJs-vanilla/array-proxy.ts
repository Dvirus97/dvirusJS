export function array<T>(...items: T[]): T[] {
    return new Proxy(items, {
        get(target, prop) {
        let _prop = Number(prop);

        if (_prop < 0) {
            const i = _prop % target.length;
            _prop = i == 0 ? 0 : i + target.length;
        }
        if (_prop >= target.length) {
            _prop = _prop % target.length;
        }
        return target[_prop as keyof typeof target];
        }
    });
}
  

function main() {
  const arr = array('a', 'b', 'c');
  console.log('[a,b,c] [-1]', arr[-1]); // 'c'
  console.log('[a,b,c] [-2]', arr[-2]); // 'b'
  console.log('[a,b,c] [-3]', arr[-3]); // 'a'
  console.log('[a,b,c] [-4]', arr[-4]); // 'c'
  console.log('[a,b,c] [0]', arr[0]); // 'a'
  console.log('[a,b,c] [1]', arr[1]); // 'b'    
  console.log('[a,b,c] [2]', arr[2]); // 'c'
  console.log('[a,b,c] [3]', arr[3]); // 'a'
  console.log('[a,b,c] [4]', arr[4]); // 'b'
  console.log('[a,b,c] [5]', arr[5]); // 'c'
  console.log('[a,b,c] [6]', arr[6]); // 'a'
}
  