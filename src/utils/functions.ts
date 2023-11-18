/**
 * 
 * @param {string}txt -text you want to slice
 * @param {number}{max=100} -max numbers of letters you want to slice
 * @returns the sliced text
 */
export function slicer(txt:string,max:number=90) {
    return txt.length > 100 ? `${txt.slice(0, max)}...` : txt

}