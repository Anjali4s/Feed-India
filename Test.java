import java.util.Scanner;

public class Test {
	public static Scanner sc = new Scanner(System.in);
	
	public static void main(String[] args) {
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