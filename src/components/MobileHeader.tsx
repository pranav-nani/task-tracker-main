import {
	Box,
	Button,
	Flex,
	IconButton,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Text,
	Link,
} from "@chakra-ui/react";
import { FaBars, FaFigma, FaGithub } from "react-icons/fa6";

export function MobileHeader() {
	return (
		<Flex
			w="100%"
			bg="cyan.500"
			maxH="60px"
			alignItems="center"
			px={4}
			boxShadow="xl"
		>
			<Popover placement="right-end">
				<PopoverTrigger>
					<IconButton
						icon={<FaBars />}
						aria-label="menu"
						variant="solid"
						backgroundColor="cyan.500"
						colorScheme="cyan.500"
						fontSize="2xl"
					/>
				</PopoverTrigger>
				<PopoverContent p={5} mt={5} bg="cyan.500" boxShadow="2xl">
					<Box bg="cyan.500">
						<Flex direction="column" px={2}>
							<Link
								href="https://www.figma.com/file/oxen1fyXzt5rAciomHfg5K/Custom-Dashboard?type=design&node-id=0%3A1&mode=design&t=mrumnsgmp73wu7kL-1"
								target="_blank"
								my={3}
							>
								<Button
									colorScheme="orange"
									width="100%"
									rightIcon={<FaFigma />}
								>
									Designs
								</Button>
							</Link>
							<Link
								href="https://github.com/dukartbr/task-tracker"
								target="_blank"
								my={3}
							>
								<Button
									colorScheme="green"
									width="100%"
									rightIcon={<FaGithub />}
								>
									Code
								</Button>
							</Link>
						</Flex>
					</Box>
				</PopoverContent>
			</Popover>
			<Text
				color="white"
				textAlign="center"
				width="100%"
				fontSize="xl"
				fontWeight="bold"
				textTransform="uppercase"
				noOfLines={1}
				py={4}
			>
				React Task Tracker
			</Text>
		</Flex>
	);
}
