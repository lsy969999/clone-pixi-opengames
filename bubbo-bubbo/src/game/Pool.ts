class InstancePool<T extends new () => InstanceType<T> = new ()=> any> {
  public readonly Ctor: T;
  public readonly list: InstanceType<T>[] = [];

  constructor(Ctor: T) {
    this.Ctor = Ctor
  }

  public get(): InstanceType<T> {
    return this.list.pop() ?? new this.Ctor()
  }

  public return(item: InstanceType<T>) {
    if (this.list.includes(item)) return;
    this.list.push(item)
  }
}

class PoolManager {
  public readonly map: Map<new () => any, InstancePool> = new Map();

  public get<T extends new () => InstanceType<T>>(Ctor: T): InstanceType<T> {
    let pool = this.map.get(Ctor);

    if (!pool) {
      pool = new InstancePool(Ctor);
      this.map.set(Ctor, pool)
    }

    return pool.get();
  }

  public return(item: InstanceType<any>) {
    const pool = this.map.get(item.constructor);
    if (pool) pool.return(item)
  }
}

export const pool = new PoolManager();