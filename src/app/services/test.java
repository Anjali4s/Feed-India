public class Test {
	Scanner sc = new Scanner(System.in);
	
	public void main() {
		int t = sc.nextInt();
		
		if(t>0) {
			for(int i=1;i<=10;i++) {
				System.out.println(t +"*"+i+" = "+t*i);
			}
		}else {
			System.out.print("Can not display table of 0");
		}
	}
}