


Replace @sygnal/sse with @sygnal/sse-core 




# Pages 

Replace 

```
import { IModule, page } from "@sygnal/sse";
```

with- 

```
import { page, PageBase } from "@sygnal/sse-core";
```


Replace `implements IModule` with `extends PageBase`


Remove `constructor()` or replace with `super()` 


## Setup

Replace

```
  setup(): void {
  }
```  


with;

```
  protected onPrepare(): void {
  }
``` 

## Exec 

Replace- 

```
  async exec(): Promise<void> {
```

with-

```
protected async onLoad(): Promise<void> {
```


# Components 


```
import { ComponentBase, PageBase, component } from '@sygnal/sse-core';
```




```
export class Navigation extends ComponentBase {
```




```
  setup(): void {
```

```
protected onPrepare(): void {
```



Replace-

```
async exec(): Promise<void> {
```

with-


```
protected async onLoad(): Promise<void> {

```